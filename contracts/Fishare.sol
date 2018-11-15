pragma solidity ^0.4.24;
import "./SafeMath.sol";

contract Fishare{
    address public owner;

    mapping(address => account) accounts;

    //total number of shares
    uint256 totalSupply_;
    //total shares sold through auction
    uint256 SharesClaimed_;
    //SeasonBeginDate stored as block timestamp
    uint256 seasonBeginDate;
    //SeasonEndDate stored as block timestamp
    uint256 seasonEndDate;
    // How many lbs of fish per share.
    uint256 public lbPerShare;
    // Amount of wei raised through taxes
    uint256 public limit;

    struct account{
        //balance of shares
        uint balance;
        //balance of ownership.  Ownership of fish is thereby seperated from the rights to catch them.
        uint own;
        bool registered;
    }

    /**
    * @dev Total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * @dev limit per address
    */
    function limit() public view returns (uint256) {
        return limit;
    }

    /**
    * @dev Register to be able to buy shares.
    */
    function register() public returns (bool){
        require(accounts[msg.sender].registered == false);
        accounts[msg.sender].registered = true;
        emit Register(msg.sender);
        return true;
    }

    /**
    * @dev Checks if registered
    */
    function isRegistered(address _address) public view returns (bool){
        return accounts[_address].registered;
    }

    /**
    * @dev Gets the number of total shares sold.
    */
    function getSharesClaimed() public view returns (uint256){
        return SharesClaimed_;
    }

    /**
    * @dev Gets the number of lbs of fish each share has the right to catch.
    */
    function getLbPerShare() public view returns (uint256){
         return lbPerShare;
     }

    /**
    * @dev Gets the balance of the specified address.
    * @param _theowner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _theowner) public view returns (uint256) {
        return accounts[_theowner].balance;
    }

    /**
    * @dev Gets the ownership balance of the specified address.
    * @param _theowner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOfOwnership(address _theowner) public view returns (uint256) {
        return accounts[_theowner].own;
    }

    /**
    * @dev Gets the block timestamp at which point the fishing season begins
    */
    function getSeasonBeginDate() public view returns (uint256){
        return seasonBeginDate;
    }

    /**
    * @dev Gets the block timestamp at which point the fishing season ends
    */
    function getSeasonEndDate() public view returns (uint256){
        return seasonEndDate;
    }

    /**
    * @dev Transfer share along with ownership to a specified address
    * @param _to The address to transfer to.
    * @param _amount The amount to be transferred.
    */
    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(_to != address(0));
        require(_amount <= accounts[msg.sender].balance);
        require(SafeMath.mul(lbPerShare,_amount) <= accounts[msg.sender].own);
        require(_amount + accounts[msg.sender].balance <= limit);
        accounts[msg.sender].balance = accounts[msg.sender].balance - _amount;
        accounts[msg.sender].own = accounts[msg.sender].own - SafeMath.mul(lbPerShare,_amount);
        accounts[_to].balance = accounts[_to].balance + (_amount);
        accounts[_to].own = accounts[_to].own + SafeMath.mul(lbPerShare,_amount);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    /**
    * @dev Transfer ownership to specified address
    * @param _to The address to transfer to.
    * @param _amount The amount to be transferred.
    */
    function transferOwnership(address _to, uint256 _amount) public returns (bool) {
        require(_to != address(0));
        require(_amount <= accounts[msg.sender].own);
        accounts[msg.sender].own = accounts[msg.sender].own - _amount;
        accounts[_to].own = accounts[_to].own + (_amount);
        emit TransferOwnership(msg.sender, _to, _amount);
        return true;
    }

    /**
    * @dev registered addresses can claim shares
    */
    function claimTokens (uint256 _numTokens) public returns(bool){
        require(now <= seasonEndDate);
        require(accounts[msg.sender].registered);
        require(accounts[msg.sender].balance + _numTokens <= limit);
        require(SharesClaimed_ + _numTokens <= totalSupply_);
        accounts[msg.sender].balance = accounts[msg.sender].balance + _numTokens;
        accounts[msg.sender].own = accounts[msg.sender].own + SafeMath.mul(lbPerShare,_numTokens);
        SharesClaimed_ = SharesClaimed_ + _numTokens;
        emit TokenClaim(msg.sender, _numTokens);
        return true;
    }

    /**
    * @dev Owner can forward funds in contract
    */
    function _forwardFunds(address _forwardAddress, uint _amount) public returns (bool){
        require(msg.sender == owner);
        require(_amount <= address(this).balance);
        _forwardAddress.transfer(_amount);
        return true;
    }

    /**
    * Event for registration logging
    * @param _registered address of registree
    */
    event Register(address indexed _registered);

    /**
    * Event for share transfer logging
    * @param _from sender of tokens
    * @param _to receiver of tokens
    * @param _value amount of tokens transfered
    */
    event Transfer(address indexed _from, address indexed _to, uint256 _value);


    /**
    * Event for fish ownership transfer logging
    * @param _from sender of tokens
    * @param _to receiver of tokens
    * @param _value amount of ownership tokens transfered
    */
    event TransferOwnership(address indexed _from, address indexed _to, uint256 _value);

    /**
    * Event for token claim logging
    * @param _claimer who paid for the tokens
    * @param _amount amount of tokens purchased
    */
    event TokenClaim(address indexed _claimer,uint256 _amount);
}








