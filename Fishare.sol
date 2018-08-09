pragma solidity ^0.4.20;
contract Fishare {
  // basicToken

  mapping(address => account) accounts;

  uint256 totalSupply_;
  uint256 SharesSold_;
  // Sale will end Dec 31 2018
  uint256 SaleEndDate = 1546300799;
  address temp;
  struct account{
        uint balance;
        bool registered;
    }
   address public owner;
  
   // Address where funds are collected
   address public wallet;
   // How many token units a buyer gets per wei.
   // The rate is the conversion between wei and the smallest and indivisible token unit.
   uint256 public rate;
   
   // Amount of wei raised
   uint256 public weiRaised;
   
   //Per address Limit
   uint256 public limit;


   // Initializes contract with initial supply tokens to the creator of the 
   //contract
   constructor (uint256 _rate, address _wallet, uint256 _initialSupply, uint256 _limit) public {
       // Give the creator all initial tokens 
       owner = msg.sender;
       require(_rate > 0);
       require(_wallet != address(0));
       rate = _rate;
       wallet = _wallet;
       totalSupply_ = _initialSupply;
       SharesSold_ = 0;
       limit = _limit;
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
   * @dev Register a fishermen to be able to buy shares
   */
  function register() public returns (bool){
      accounts[msg.sender].registered = true;
      return true;
  }
  
   /**
   * @dev Checks if fishermen is registered
   */
  function isRegistered(address _address) public view returns (bool){
      return accounts[_address].registered;
  }

  /**
  * @dev Gets the number of total shares sold.
  */
  function getSharesSold() public view returns (uint256){
      return SharesSold_;
  }

  /**
  * @dev Transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _amount The amount to be transferred.
  */
  function transfer(address _to, uint256 _amount) public returns (bool) {
    require(_to != address(0));
    require(_amount <= accounts[msg.sender].balance);
    require(_amount + accounts[msg.sender].balance <= limit);
    accounts[msg.sender].balance = accounts[msg.sender].balance - _amount;
    accounts[_to].balance = accounts[_to].balance + (_amount);
    emit Transfer(msg.sender, _to, _amount);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _theowner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _theowner) public view returns (uint256) {
    return accounts[_theowner].balance;
  }
  
  event Transfer(address indexed from, address indexed to, uint256 value);
  
  /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(address indexed purchaser,uint256 value,uint256 amount);
  
  event TokenRefund(address indexed purchaser,uint256 value,uint256 amount);
  
  
  /**
   * @dev low level token purchase
   */
  function buyTokens () public payable {
    require(now <= SaleEndDate);
    require(accounts[msg.sender].registered);
    uint256 numTokens;
    numTokens = _getTokenAmount(msg.value);
    require(accounts[msg.sender].balance + numTokens <= limit); 
    require(SharesSold_ + numTokens <= totalSupply_);
    accounts[msg.sender].balance = accounts[msg.sender].balance + numTokens;
    SharesSold_ = SharesSold_ + numTokens;
    weiRaised = weiRaised + msg.value;
    emit TokenPurchase(msg.sender, msg.value, numTokens);
  }
  
  /**
   * @dev low level token purchase
   */
  function SellTokens () public payable {
    require(now <= SaleEndDate);
    require(accounts[msg.sender].registered);
    uint256 numTokens;
    numTokens = _getTokenAmount(msg.value);
    require(accounts[msg.sender].balance >= numTokens); 
    accounts[msg.sender].balance = accounts[msg.sender].balance - numTokens;
    SharesSold_ = SharesSold_ - numTokens;
    weiRaised = weiRaised - msg.value;
    emit TokenRefund(msg.sender, msg.value, numTokens);
  }

  /**
   * @dev Override to extend the way in which ether is converted to tokens.
   * @param _weiAmount Value in wei to be converted into tokens
   * @return Number of tokens that can be purchased with the specified _weiAmount
   */
  function _getTokenAmount(uint256 _weiAmount)
    internal view returns (uint256)
  {
    return mul(_weiAmount,rate);
  }

  /**
   * @dev Determines how ETH is stored/forwarded on purchases.
   */
  function _forwardFunds() internal {
    wallet.transfer(msg.value);
  }
  
  //SafeMath
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}
