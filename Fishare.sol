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
  
  function register() public returns (bool){
      accounts[msg.sender].registered = true;
      return true;
  }
  
  function isRegistered(address _address) public view returns (bool){
      return accounts[_address].registered;
  }

  function getSharesSold() public view returns (uint256){
      return SharesSold_;
  }

  /**
  * @dev Transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= accounts[msg.sender].balance);
	
    accounts[msg.sender].balance = accounts[msg.sender].balance - _value;
    accounts[_to].balance = accounts[_to].balance + (_value);
    //emit Transfer(msg.sender, _to, _value);
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

   address public owner;
   struct fisherman{
      uint256 ID;
      uint256 Limit;
   }
   
   mapping (address => mapping (address => uint256)) internal allowed;
   
   function transferr(address _to, uint256 _value) public payable {
       transferFrom(msg.sender, _to, _value);
   }



  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public 
    returns (bool)
  {
    require(_to != address(0));
    require(_value <= accounts[_from].balance);
    require(_value <= allowed[_from][msg.sender]);

    accounts[_from].balance = accounts[_from].balance - _value;
    accounts[_to].balance = accounts[_to].balance + (_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender] - (_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }
  
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(
    address _owner,
    address _spender
   )
    public
    view
    returns (uint256)
  {
    return allowed[_owner][_spender];
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
  function increaseApproval(
    address _spender,
    uint256 _addedValue
  )
    public
    returns (bool)
  {
    allowed[msg.sender][_spender] = (
      allowed[msg.sender][_spender] + (_addedValue));
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseApproval(
    address _spender,
    uint256 _subtractedValue
  )
    public
    returns (bool)
  {
    uint256 oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue > oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue - (_subtractedValue);
    }
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }
  
  /**
   * Event for token purchase logging
   * @param purchaser who paid for the tokens
   * @param value weis paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokenPurchase(
    address indexed purchaser,
    uint256 value,
    uint256 amount
  );
  
  
  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
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
  }
  
  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   */
  function SellTokens () public payable {
    require(now <= SaleEndDate);
    require(accounts[msg.sender].registered);
    uint256 numTokens;
    numTokens = _getTokenAmount(msg.value);
    require(accounts[msg.sender].balance >= numTokens); 
    accounts[msg.sender].balance = accounts[msg.sender].balance - numTokens;
    SharesSold_ = SharesSold_ - numTokens;
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------


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
}

