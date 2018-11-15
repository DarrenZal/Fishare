pragma solidity ^0.4.24;
import "./Fishare.sol";
import "./SafeMath.sol";
import "./Exchange.sol";
contract Escrow is Exchange{

    // object representing an escrow contract
    struct escrow{
        bool buyerSigned;
        bool sellerSigned;
        bool buyerUnSigned;
        bool sellerUnSigned;
        bool buyerReleased;
        bool sellerReleased;
        address seller;
        address buyer;
        address arbiter;
        uint256 price;
        uint256 amount;
        uint256 percentUpFront;
        bool buyerDisputed;
        bool sellerDisputed;
        bool taxIncluded;
    }

    // an array to hold all active escrow contracts
    escrow[] escrowContracts;

    // keeps track of how much of the funds held by this contract are allocated to the escrow pool
    uint256 escrowPool;
    //tax rate as percent.  Facilitates automatic tax collection and auditing.
    uint256 TaxRate;
    // tax address is the wallet to send taxes to
    address TaxAddress;

    /**
    * @dev returns tax rate
    */
    function getTaxRate() public view returns (uint256){
        return TaxRate;
    }

    /**
    * @dev returns tax address
    */
    function getTaxAddress() public view returns (address){
        return TaxAddress;
    }

    /**
    * @dev Initialize main contract
    * @param _lbPerShare how many lbs of fish each share has the right to catch
    * @param _initialSupply how many shares to create for sale
    * @param _limit per address limit of shares
    * @param _taxRate tax rate as percentage out of 100
    * @param _taxAddress address taxes will be forwarded to
    * @param _seasonBeginDate block timestamp of when the fishing season will begin
    * @param _seasonEndDate block timestamp of when the fishing season will end
    */
    constructor (uint256 _lbPerShare, uint256 _initialSupply, uint256 _limit, uint256 _taxRate, address _taxAddress, uint256 _seasonBeginDate, uint256 _seasonEndDate) public {
        owner = msg.sender;
        lbPerShare = _lbPerShare;
        totalSupply_ = _initialSupply;
        SharesClaimed_ = 0;
        limit = _limit;
        TaxRate = _taxRate;
        if(_taxRate > 0){
            require(_taxAddress != address(0));
        }
        TaxAddress = _taxAddress;
        seasonBeginDate = _seasonBeginDate;
        seasonEndDate = _seasonEndDate;
    }

    /**
    * @dev Creates escrow contract, either buyer or seller can create one
    * @param _seller address of seller leave blank to allow anyone to sign as seller
    * @param _buyer address of buyer leave blank to allow anyone to sign as buyer
    * @param _arbiter address of arbiter, leave blank to put creater of escrow as arbiter
    * @param _price total cost of the deal
    * @param _amount total ownership tokens of the deal
    * @param _percentUpFront percent of total cost to be paid to seller once both parties sign
    * @param _taxIncluded If an automatic tax payment will be paid to TaxAddress at completion of escrow
    */
    function createEscrow(address _seller, address _buyer, address _arbiter, uint256 _price, uint256 _amount, uint256 _percentUpFront, bool _taxIncluded) public payable returns (bool){
        bool buyerSigned = false;
        bool sellerSigned = false;
        require(0 <= _percentUpFront && _percentUpFront <= 100);
        if(msg.sender == _seller){
            require(msg.value == 0);
            require(_amount <= accounts[msg.sender].own);
            accounts[msg.sender].own -= _amount;
            escrowPool += _amount;
            sellerSigned = true;
        } else {
            require(msg.sender == _buyer);
            if(_taxIncluded == true){
                require(msg.value == SafeMath.div(SafeMath.mul(100+TaxRate,_price),100));
            } else {
                require(msg.value == _price);
            }
            buyerSigned = true;
        }
        escrowContracts.push(escrow(buyerSigned, sellerSigned, false, false, false, false, _seller, _buyer, _arbiter, _price, _amount, _percentUpFront, false, false, _taxIncluded));
    }

    /**
    * @dev completes the escrow contract, transfering payment to seller and ownership to buyer, both parties must release
    * @param _index specifies which escrow contract to release
    */
    function releaseEscrow(uint256 _index) public returns (bool){
        require(_index < escrowContracts.length);
        if(escrowContracts[_index].buyer == msg.sender && escrowContracts[_index].buyerSigned == true && escrowContracts[_index].buyerUnSigned == false){
            escrowContracts[_index].buyerReleased = true;
        } else if(escrowContracts[_index].seller == msg.sender && escrowContracts[_index].sellerSigned == true && escrowContracts[_index].buyerUnSigned == false){
            escrowContracts[_index].sellerReleased = true;
        } else return false;
        if(escrowContracts[_index].buyerReleased && escrowContracts[_index].sellerReleased){
            require(escrowContracts[_index].amount <= escrowPool);
            require(escrowContracts[_index].buyerDisputed == false && escrowContracts[_index].sellerDisputed == false);
            accounts[ escrowContracts[_index].buyer ].own += escrowContracts[_index].amount;
            escrowPool -= escrowContracts[_index].amount;
            //transfer funds to the seller minus how much was paid up front
            escrowContracts[_index].seller.transfer(SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront,escrowContracts[_index].price),100));
            //pay taxes, which were collected when the buyer signed if the contract had taxIncluded == true
            if(escrowContracts[_index].taxIncluded == true){
                TaxAddress.transfer( SafeMath.div(SafeMath.mul(TaxRate,escrowContracts[_index].price),100) );
            }
            removeEscrow(_index);
        }
        return true;
    }

    /**
    * @dev Allows buyer and seller to unRelease Escrow
    * @param _index specifies which escrow contract to unRelease
    */
    function unReleaseEscrow(uint256 _index) public returns (bool){
        require(_index < escrowContracts.length);
        if(escrowContracts[_index].buyer == msg.sender && escrowContracts[_index].buyerReleased == true){
            escrowContracts[_index].buyerReleased = false;
        } else if(escrowContracts[_index].seller == msg.sender && escrowContracts[_index].sellerReleased == true){
            escrowContracts[_index].sellerReleased = false;
        }
        return true;
    }

    /**
    * @dev If an address has created and signed the escrow contract putting in Alice's name as the other party, Alice will need to sign to validate the contract
    * Or, if the other party created an escrow contract with a blank address (address(0)), Alice can fill that slot and sign
    * @param _index specifies which escrow contract to sign
    */
    function signEscrow(uint256 _index) public payable returns (bool){
        require(_index < escrowContracts.length);
        if((escrowContracts[_index].buyer == msg.sender || escrowContracts[_index].buyer == address(0)) && escrowContracts[_index].buyerSigned == false){
            if(escrowContracts[_index].taxIncluded == true){
                require(msg.value == SafeMath.div(SafeMath.mul(100+TaxRate,escrowContracts[_index].price),100));
            } else {
                require(msg.value == escrowContracts[_index].price);
            }
            escrowContracts[_index].buyer = msg.sender;
            if(escrowContracts[_index].percentUpFront > 0 ){
                escrowContracts[_index].seller.transfer(SafeMath.div(SafeMath.mul(escrowContracts[_index].percentUpFront,escrowContracts[_index].price),100));
            }
            escrowContracts[_index].buyerSigned = true;
            return true;
        } else if((escrowContracts[_index].seller == msg.sender || escrowContracts[_index].seller == address(0)) && escrowContracts[_index].sellerSigned == false){
            require(msg.value == 0);
            require(escrowContracts[_index].amount <= accounts[msg.sender].own);
            escrowContracts[_index].seller = msg.sender;
            accounts[msg.sender].own -= escrowContracts[_index].amount;
            escrowPool += escrowContracts[_index].amount;
            if(escrowContracts[_index].percentUpFront > 0 ){
                escrowContracts[_index].seller.transfer(SafeMath.div(SafeMath.mul(escrowContracts[_index].percentUpFront,escrowContracts[_index].price),100));
            }
            escrowContracts[_index].sellerSigned = true;
            return true;
        }
        else return false;
    }

    /**
    * @dev Allows the buyer and seller to unsign a contract, it also automatically deletes the contract once both have unsigned
    * this allows buyer and seller to delete the contract without arbitration
    * @param _index specifies which escrow contract to unSign
    */
    function unSignEscrow(uint256 _index) public returns (bool){
        require(_index < escrowContracts.length);
        require(escrowContracts[_index].buyer == msg.sender || escrowContracts[_index].seller == msg.sender);
        if(escrowContracts[_index].buyer == msg.sender && escrowContracts[_index].buyerSigned == true){
            escrowContracts[_index].buyerUnSigned = true;
            if (escrowContracts[_index].sellerSigned == false){
                //seller never signed, can refund buyer his money (minus percent paid up front) and delete the contract
                //If tax was put in escrow up front, refund the tax as well
                if(escrowContracts[_index].taxIncluded == true){
                    escrowContracts[_index].buyer.transfer(SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront+TaxRate,escrowContracts[_index].price),100));
                } else {
                    escrowContracts[_index].buyer.transfer(SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront,escrowContracts[_index].price),100));
                }
                removeEscrow(_index);
                return true;
            }
        } else if (escrowContracts[_index].seller == msg.sender && escrowContracts[_index].sellerSigned == true){
            escrowContracts[_index].sellerUnSigned = true;
            if (escrowContracts[_index].buyerSigned == false){
                //buyer never signed, can refund seller his shares and delete the contract
                accounts[escrowContracts[_index].seller].own += escrowContracts[_index].amount;
                escrowPool -= escrowContracts[_index].amount;
                removeEscrow(_index);
                return true;
            }
        } else return false;
        if (escrowContracts[_index].buyerUnSigned == true && escrowContracts[_index].sellerUnSigned == true){
            //both parties have signed but then unsigned, can refund both and delete contract
            accounts[escrowContracts[_index].seller].own += escrowContracts[_index].amount;
            escrowPool -= escrowContracts[_index].amount;
            //Buyer paid percentUpFront when they signed, so remove that from the refund
            //If tax was put in escrow up front, refund the tax as well
            if(escrowContracts[_index].taxIncluded == true){
                escrowContracts[_index].buyer.transfer(SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront+TaxRate,escrowContracts[_index].price),100));
            } else {
                escrowContracts[_index].buyer.transfer(SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront,escrowContracts[_index].price),100));
            }
            removeEscrow(_index);
        }
        return true;
    }

    /**
    * @dev Buyer or Seller can dispute an escrow contract if they have signed
    * @param _index specifies which escrow contract to dispute
    */
    function disputeEscrow(uint256 _index) public returns (bool){
        require(_index < escrowContracts.length);
        //only buyer or seller can dispute a contract, and onyl if they have signed it
        if(escrowContracts[_index].buyer == msg.sender){
            require(escrowContracts[_index].buyerSigned == true);
            require(escrowContracts[_index].buyerDisputed == false);
            escrowContracts[_index].buyerDisputed = true;
        } else if (escrowContracts[_index].seller == msg.sender){
            require(escrowContracts[_index].sellerSigned == true);
            require(escrowContracts[_index].sellerDisputed == false);
            escrowContracts[_index].sellerDisputed = true;
        } else return false;
        return true;
    }

    /**
    * @dev Buyer or Seller can unDispute an escrow contract if they have disputed
    * @param _index specifies which escrow contract to unDispute
    */
    function unDisputeEscrow(uint256 _index) public returns (bool){
        require(_index < escrowContracts.length);
        //only buyer or seller can dispute a contract, and onyl if they have signed it
        if(escrowContracts[_index].buyer == msg.sender){
            require(escrowContracts[_index].buyerDisputed == true);
            escrowContracts[_index].buyerDisputed = false;
        } else if (escrowContracts[_index].seller == msg.sender){
            require(escrowContracts[_index].sellerDisputed == true);
            escrowContracts[_index].sellerDisputed = false;
        } else return false;
        return true;
    }

    /**
    * @dev Arbiter can arbitrate an escrow contract, divying up the ownership tokens and funds held in the escrow contract between buyer and seller
    * @param _index specifies which escrow contract to arbitrate
    * @param _amountToSeller Amount of ownership tokens to give seller
    * @param _amountToBuyer Amount of ownership tokens to give buyer
    * @param _paymentToSeller funds to give seller
    * @param _paymentToBuyer funds to give seller
    */
    function arbitrateEscrow(uint256 _index, uint256 _amountToSeller, uint256 _amountToBuyer, uint256 _paymentToSeller, uint256 _paymentToBuyer) public returns (bool){
        require(_index < escrowContracts.length);
        require(msg.sender == escrowContracts[_index].arbiter);
        require(escrowContracts[_index].buyerDisputed == true || escrowContracts[_index].sellerDisputed == true);
        if(escrowContracts[_index].buyerDisputed == false){
            require(msg.sender != escrowContracts[_index].seller);
        } else if (escrowContracts[_index].sellerDisputed == false){
            require(msg.sender != escrowContracts[_index].buyer);
        }
        require(escrowContracts[_index].buyerSigned == true && escrowContracts[_index].sellerSigned == true);
        if(escrowContracts[_index].taxIncluded == true){
            require(_paymentToSeller + _paymentToBuyer <= SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront+TaxRate,escrowContracts[_index].price),100));
        } else {
            require(_paymentToSeller + _paymentToBuyer <= SafeMath.div(SafeMath.mul(100-escrowContracts[_index].percentUpFront,escrowContracts[_index].price),100));
        }
        require(_amountToSeller + _amountToBuyer == escrowContracts[_index].amount);
        if(_paymentToSeller > 0){
            escrowContracts[_index].seller.transfer(_paymentToSeller);
        }
        accounts[escrowContracts[_index].seller].own += _amountToSeller;
        if(_paymentToBuyer > 0){
            escrowContracts[_index].buyer.transfer(_paymentToBuyer);
        }
        accounts[escrowContracts[_index].buyer].own += _amountToBuyer;
        escrowPool -= escrowContracts[_index].amount;
        removeEscrow(_index);
        return true;
    }

    /**
    * @dev returns core state of escrow contracts as arrays
    */
    function getEscrows() public view returns (address[], address[], address[], uint256[], uint256[], uint256[], bool[]){
        address[] memory sellers= new address[](escrowContracts.length);
        address[] memory buyers= new address[](escrowContracts.length);
        address[] memory arbiters= new address[](escrowContracts.length);
        uint256[] memory prices= new uint256[](escrowContracts.length);
        uint256[] memory amounts= new uint256[](escrowContracts.length);
        uint256[] memory percentsUpFront = new uint256[](escrowContracts.length);
        bool[] memory taxIncluded = new bool[](escrowContracts.length);
        for (uint i=0; i<escrowContracts.length; i++) {
            //Give contracts that either have buyer/address = msg.sender, or have buyer/address as blank (signaling they are open offers)
            if (msg.sender == escrowContracts[i].seller || msg.sender == escrowContracts[i].buyer || escrowContracts[i].seller == address(0) || escrowContracts[i].buyer == address(0)){
                sellers[i] = escrowContracts[i].seller;
                buyers[i] = escrowContracts[i].buyer;
                arbiters[i] = escrowContracts[i].arbiter;
                prices[i] = escrowContracts[i].price;
                amounts[i] = escrowContracts[i].amount;
                percentsUpFront[i] = escrowContracts[i].percentUpFront;
                taxIncluded[i] = escrowContracts[i].taxIncluded;
            }
        }
        return (sellers, buyers, arbiters, prices, amounts, percentsUpFront, taxIncluded);
    }

    /**
    * @dev returns escrow buyer signatures.  functions can only handle finite parameters so split getEscrows
    */
    function getBuyerEscrowSignatures() public view returns (bool[], bool[], bool[], bool[]){
        bool[] memory buyerSigned= new bool[](escrowContracts.length);
        bool[] memory buyerUnSigned = new bool[](escrowContracts.length);
        bool[] memory buyerReleased = new bool[](escrowContracts.length);
        bool[] memory buyerDisputed = new bool[](escrowContracts.length);
        for (uint i=0; i<escrowContracts.length; i++) {
            //Give contracts that either have buyer/address = msg.sender, or have buyer/address as blank (signaling they are open offers)
            if (msg.sender == escrowContracts[i].seller || msg.sender == escrowContracts[i].buyer || escrowContracts[i].seller == address(0) || escrowContracts[i].buyer == address(0)){
                buyerSigned[i] = escrowContracts[i].buyerSigned;
                buyerUnSigned[i] = escrowContracts[i].buyerUnSigned;
                buyerReleased[i] = escrowContracts[i].buyerReleased;
                buyerDisputed[i] = escrowContracts[i].buyerDisputed;
            }
        }
        return (buyerSigned, buyerUnSigned, buyerReleased, buyerDisputed);
    }

    /**
    * @dev returns escrow seller signatures.  functions can only handle finite parameters so split getEscrows
    */
    function getSellerEscrowSignatures() public view returns (bool[], bool[], bool[], bool[]){
        bool[] memory sellerSigned= new bool[](escrowContracts.length);
        bool[] memory sellerUnSigned = new bool[](escrowContracts.length);
        bool[] memory sellerReleased = new bool[](escrowContracts.length);
        bool[] memory sellerDisputed = new bool[](escrowContracts.length);
        for (uint i=0; i<escrowContracts.length; i++) {
            //Give contracts that either have buyer/address = msg.sender, or have buyer/address as blank (signaling they are open offers)
            if (msg.sender == escrowContracts[i].seller || msg.sender == escrowContracts[i].buyer || escrowContracts[i].seller == address(0) || escrowContracts[i].buyer == address(0)){
                sellerSigned[i] = escrowContracts[i].sellerSigned;
                sellerUnSigned[i] = escrowContracts[i].sellerUnSigned;
                sellerReleased[i] = escrowContracts[i].sellerReleased;
                sellerDisputed[i] = escrowContracts[i].sellerDisputed;
            }
        }
        return (sellerSigned, sellerUnSigned, sellerReleased, sellerDisputed);
    }

    /**
    * @dev removes escrow contract
    */
    function removeEscrow(uint _index) internal {
        require(_index < escrowContracts.length);
        if (_index >= escrowContracts.length) return;
        for (uint i = _index; i<escrowContracts.length-1; i++){
            escrowContracts[i] = escrowContracts[i+1];
        }
        delete escrowContracts[escrowContracts.length-1];
        escrowContracts.length--;
    }
}
