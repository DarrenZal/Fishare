pragma solidity ^0.4.24;
import "./Fishare.sol";

contract Exchange is Fishare{

    struct order{
        address account;
        uint256 amount;
        uint256 price;
    }

    order[] buyOrders;
    order[] sellOrders;

    uint256 exchangePool;

    /**
    * @dev Gets buy orders as arrays of addresses, amounts, and prices
    */
    function getBuyOrders() public view returns (address[], uint256[], uint256[]){
        address[] memory addresses= new address[](buyOrders.length);
        uint256[] memory amount= new uint256[](buyOrders.length);
        uint256[] memory price= new uint256[](buyOrders.length);
        for (uint i=0; i<buyOrders.length; i++) {
            addresses[i] = buyOrders[i].account;
            amount[i] = buyOrders[i].amount;
            price[i] = buyOrders[i].price;
        }
        return (addresses, amount, price);
    }

    /**
    * @dev Gets sell orders as arrays of addresses, amounts, and prices
    */
    function getSellOrders() public view returns (address[], uint256[], uint256[]){
        address[] memory addresses= new address[](sellOrders.length);
        uint256[] memory amount= new uint256[](sellOrders.length);
        uint256[] memory price= new uint256[](sellOrders.length);
        for (uint i=0; i<sellOrders.length; i++) {
            addresses[i] = sellOrders[i].account;
            amount[i] = sellOrders[i].amount;
            price[i] = sellOrders[i].price;
        }
        return (addresses, amount, price);
    }

    /**
    * @dev Posts a limit buy order
    * @param _amount The amount of share tokens to be bought.
    * @param _price The price per token.
    */
    function PostLimitBuy(uint256 _amount, uint256 _price) public payable returns (bool) {
    require(SafeMath.mul(_amount, _price) == msg.value);
    require(SafeMath.add(_amount, accounts[msg.sender].balance) <= limit);
    require(accounts[msg.sender].registered);
    if(buyOrders.length == 0){
        buyOrders.push(order(msg.sender, _amount, _price));
        emit PostBuyOrder(msg.sender, _amount, _price);
        return true;
    } else {
    for (uint i = 0; i < buyOrders.length; i++){
        if(_price <= buyOrders[i].price){
            buyOrderInsert(order(msg.sender, _amount, _price), i);
            emit PostBuyOrder(msg.sender, _amount, _price);
            return true;
        }
    }
    //order is new highest bid, push it to the end
    buyOrders.push(order(msg.sender, _amount, _price));
    emit PostBuyOrder(msg.sender, _amount, _price);
    return true;
    }
    }


    /**
    * @dev Posts a limit buy order, sell orders will be kept in ordered array with lowest price at end of array
    * @param _amount The amount of share tokens to be sold.
    * @param _price The price per token.
    */
    function PostLimitSell(uint256 _amount, uint256 _price) public returns (bool) {
    require(_amount <= accounts[msg.sender].balance);
    require(accounts[msg.sender].registered);
    if(sellOrders.length == 0){
        sellOrders.push(order(msg.sender, _amount, _price));
        exchangePool = exchangePool + _amount;
        accounts[msg.sender].balance = accounts[msg.sender].balance - _amount;
        accounts[msg.sender].own = accounts[msg.sender].own - _amount;
        emit PostSellOrder(msg.sender, _amount, _price);
        return true;
    } else {
        for (uint i = 0; i < sellOrders.length; i++){
            if(_price >= sellOrders[i].price){
                sellOrderInsert(order(msg.sender, _amount, _price), i);
                exchangePool = exchangePool + _amount;
                accounts[msg.sender].balance = accounts[msg.sender].balance - _amount;
                accounts[msg.sender].own = accounts[msg.sender].own - _amount;
                emit PostSellOrder(msg.sender, _amount, _price);
                return true;
            }
        }
        //order is new lowest bid, push it to the end
        sellOrders.push(order(msg.sender, _amount, _price));
        exchangePool = exchangePool + _amount;
        accounts[msg.sender].balance = accounts[msg.sender].balance - _amount;
        accounts[msg.sender].own = accounts[msg.sender].own - _amount;
        emit PostSellOrder(msg.sender, _amount, _price);
        return true;
    }
    }

    /**
    * @dev Inserts a buy order
    * @param _order The order to be posted.
    * @param _index The position to insert the order (kept ordered by price).
    */
    function buyOrderInsert(order _order, uint256 _index) internal {
        buyOrders.push(buyOrders[buyOrders.length - 1]);
        for(uint i = buyOrders.length - 1; i > _index; i--){
            buyOrders[i] = buyOrders[i-1];
        }
        buyOrders[i] = _order;
    }

    /**
    * @dev Inserts a sell order
    * @param _order The order to be posted.
    * @param _index The position to insert the order (kept ordered by price).
    */
    function sellOrderInsert(order _order, uint256 _index) internal {
        sellOrders.push(sellOrders[sellOrders.length - 1]);
        for(uint i = sellOrders.length - 1; i > _index; i--){
            sellOrders[i] = sellOrders[i-1];
        }
        sellOrders[i] = _order;
    }

    /**
    * @dev Cancels a buy order
    * @param _index The location of the order
    */
    function CancelLimitBuy(uint256 _index) public {
        require(buyOrders[_index].account == msg.sender);
        msg.sender.transfer(SafeMath.mul(buyOrders[_index].amount,buyOrders[_index].price));
        removeBuyOrder(_index);
    }

    /**
    * @dev Cancels a sell order
    * @param _index The location of the order
    */
    function CancelLimitSell(uint256 _index) public {
        require(sellOrders[_index].account == msg.sender);
        exchangePool = exchangePool - sellOrders[_index].amount;
        accounts[msg.sender].balance = accounts[msg.sender].balance + sellOrders[_index].amount;
        accounts[msg.sender].own = accounts[msg.sender].own + sellOrders[_index].amount;
        removeSellOrder(_index);
    }

    /**
    * @dev Fills sell orders, from lowest price to highest
    * @param _numOrders The number of orders to fill
    * @param _change How much volume to leave in the last order filled, allows partial filling
    */
    function fillSellOrders(uint256 _numOrders, uint256 _change) public  payable{
        uint256 refund = msg.value;
        uint256 sharesToBuyer;
        require(sellOrders.length >= _numOrders);
        for(uint i = 1; i < _numOrders; i++){
            uint256 orderVal = SafeMath.mul(sellOrders[sellOrders.length - 1].price,sellOrders[sellOrders.length - 1].amount);
            require(refund >= orderVal);
            refund = refund - orderVal;
            sharesToBuyer = sharesToBuyer + sellOrders[sellOrders.length - 1].amount;
            exchangePool = exchangePool - sellOrders[sellOrders.length - 1].amount;
            sellOrders[sellOrders.length - 1].account.transfer(orderVal);
            delete(sellOrders[sellOrders.length - 1]);
            sellOrders.length--;
        }
        sharesToBuyer = sharesToBuyer + sellOrders[sellOrders.length - 1].amount - _change;
        exchangePool = exchangePool - sellOrders[sellOrders.length - 1].amount + _change;
        require(refund >= SafeMath.mul(sellOrders[sellOrders.length - 1].price,sellOrders[sellOrders.length - 1].amount - _change));
        refund = refund - SafeMath.mul(sellOrders[sellOrders.length - 1].price,sellOrders[sellOrders.length - 1].amount - _change);
        sellOrders[sellOrders.length - 1].account.transfer(SafeMath.mul(sellOrders[sellOrders.length - 1].price,sellOrders[sellOrders.length - 1].amount - _change));
        if(_change > 0){
            sellOrders[sellOrders.length - 1].amount = _change;
        } else {
            delete(sellOrders[sellOrders.length - 1]);
            sellOrders.length--;
        }
        if (refund > 0){
            msg.sender.transfer(refund);
        }
        accounts[msg.sender].balance = accounts[msg.sender].balance + sharesToBuyer;
        accounts[msg.sender].own = accounts[msg.sender].own + sharesToBuyer;
    }

    /**
    * @dev Fills buy orders, from highest price to lowest
    * @param _numOrders The number of orders to fill
    * @param _change How much volume to leave in the last order filled, allows partial filling
    */
    function fillBuyOrders(uint256 _numOrders, uint256 _change) public {
        uint256 sharesToBuyers;
        uint256 payment = 0;
        require(buyOrders.length >= _numOrders);
        for(uint k = 1; k < _numOrders; k++){
            payment = payment + SafeMath.mul(buyOrders[buyOrders.length - 1].price,buyOrders[buyOrders.length - 1].amount);
            sharesToBuyers = sharesToBuyers + buyOrders[buyOrders.length - 1].amount;
            accounts[buyOrders[buyOrders.length - 1].account].balance = accounts[buyOrders[buyOrders.length - 1].account].balance + buyOrders[buyOrders.length - 1].amount;
            accounts[buyOrders[buyOrders.length - 1].account].own = accounts[buyOrders[buyOrders.length - 1].account].own + buyOrders[buyOrders.length - 1].amount;
            delete(buyOrders[buyOrders.length - 1]);
            buyOrders.length--;
        }
        sharesToBuyers = sharesToBuyers + buyOrders[buyOrders.length - 1].amount - _change;
        accounts[buyOrders[buyOrders.length - 1].account].balance = accounts[buyOrders[buyOrders.length - 1].account].balance + buyOrders[buyOrders.length - 1].amount - _change;
        accounts[buyOrders[buyOrders.length - 1].account].own = accounts[buyOrders[buyOrders.length - 1].account].own + buyOrders[buyOrders.length - 1].amount - _change;
        payment = payment + SafeMath.mul(buyOrders[buyOrders.length - 1].price,buyOrders[buyOrders.length - 1].amount - _change);
        msg.sender.transfer(payment);
        if(_change > 0){
            buyOrders[buyOrders.length - 1].amount = _change;
        } else {
            delete(buyOrders[buyOrders.length - 1]);
            buyOrders.length--;
        }
        require(accounts[msg.sender].balance >= sharesToBuyers);
        accounts[msg.sender].balance = accounts[msg.sender].balance - sharesToBuyers;
        accounts[msg.sender].own = accounts[msg.sender].own - sharesToBuyers;
    }

    /**
    * @dev removes buy order from the array
    * @param _index The position of the order
    */
    function removeBuyOrder(uint _index) internal {
        if (_index >= buyOrders.length) return;
        for (uint i = _index; i<buyOrders.length-1; i++){
            buyOrders[i] = buyOrders[i+1];
        }
        delete buyOrders[buyOrders.length-1];
        buyOrders.length--;
    }

    /**
    * @dev removes sell order from the array
    * @param _index The position of the order
    */
    function removeSellOrder(uint _index) internal {
        if (_index >= sellOrders.length) return;
        for (uint i = _index; i<sellOrders.length-1; i++){
            sellOrders[i] = sellOrders[i+1];
        }
        delete sellOrders[sellOrders.length-1];
        sellOrders.length--;
    }

    /**
    * Event for posting a buy order
    * @param _poster address of buyer
    * @param _amount amount of share tokens
    * @param _value price of the order
    */
    event PostBuyOrder(address indexed _poster, uint256 _amount,uint256 _value);

    /**
    * Event for posting a sell order
    * @param _poster address of seller
    * @param _amount amount of share tokens
    * @param _value price of the order
    */
    event PostSellOrder(address indexed _poster, uint256 _amount,uint256 _value);
}
