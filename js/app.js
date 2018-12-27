var account;
var sellMarketPrice;
var buyMarketPrice;
var totalSellOrders = 0;
var totalEscrowSellOrders = 0;
var totalBuyOrders = 0;
var totalEscrowBuyOrders = 0;
var totalEscrowOpenBuyOrders = 0;
var totalEscrowOpenSellOrders = 0;
var accountOrderLength = 0;
var escrowOpenOrderLength = 0;
var escrowOrderLength = 0;
const testKey = "532183c26ba882659f5110f5747a7f290b8a525cadd98b7fa6f01f5df71b89bd"
const testAddress = "0x981350A3C47D37b268ebF93BcFf1Ae133f84429a";
const contractAddress = "0x60c3c7e1d57d3bbaa9277a8dfdbdf4d8daeffa8e";
var tester = false;
var transactionCount = 0;
var cancelBuyOrder = function(arg) {
    return function() { App.removeBuyOrder(arg); };
};
var cancelSellOrder = function(arg) {
    return function() { App.removeSellOrder(arg); };
};
var showEscrowActions = function(id, sellers, buyers, arbiters, prices, amounts, percentsUpFront, taxIncluded, sellerSigned, buyerSigned, sellerUnSigned, buyerUnSigned, sellerReleased, buyerReleased, buyerDisputed, sellerDisputed) {
    return function() { App.popUpEscrowActions(id, sellers, buyers, arbiters, prices, amounts, percentsUpFront, taxIncluded, sellerSigned, buyerSigned, sellerUnSigned, buyerUnSigned, sellerReleased, buyerReleased, buyerDisputed, sellerDisputed); };
};
var disputeEscrow = function(arg) {
    return function() { App.DisputeEscrow(arg); };
};
var unsignEscrow = function(arg) {
    return function() { App.UnsignEscrow(arg); };
};
var unDisputeEscrow = function(arg) {
    return function() { App.unDisputeEscrow(arg); };
};
var releaseEscrow = function(arg) {
    return function() { App.releaseEscrow(arg); };
};
var unreleaseEscrow = function(arg) {
    return function() { App.unreleaseEscrow(arg); };
};
var signEscrow = function(arg, payment, type, amount) {
    return function() { App.signEscrow(arg, payment, type, amount); };
};
var arbitrateEscrow = function(arg) {
    return function() { App.arbitrateEscrow(arg); };
};
var alertText = function(arg) {
    return function() { App.alertText(arg); };
};
var submitArbitration = function(id){
    return function() {App.submitArbitration(id); };
};
var transDetails = function(Date, buyer, seller, Amount, price, percentUpFront, arbiter, taxIncluded){
    return function() {App.transDetails(Date, buyer, seller, Amount, price, percentUpFront, arbiter, taxIncluded); };
};
var showTransModal = function(date, transHash, event, args) {
    return function() { App.showTransModal(date, transHash, event, args); };
};
var openTransinEtherscan = function(transHash) {
    return function() { App.openTransinEtherscan(transHash); };
},
App = {
web3Provider: null,
contracts: {},
init:
    function() {
        return App.initWeb3();
        
    },
    
initWeb3: function() {
    var Web3 = require('web3');
    //Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
        if(web3.version.network != 3){
            alert("Please switch to the ropsten testnet");
        } else
            web3.eth.getAccounts(function(error, accounts) {
                                 account = accounts[0];
                                 if(account == undefined){
                                 alert("No accounts found. If you're using MetaMask, " + "please unlock it first and reload the page.");
                                 }
                                 web3 = new Web3(App.web3Provider);
                                 return App.initContract();
                                 });
    } else {
        // If no injected web3 instance is detected, user Infura
        App.web3Provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/4b559a9b6ed64477a68c49e426efebeb");
        account = "0x981350A3C47D37b268ebF93BcFf1Ae133f84429a";
        web3 = new Web3(App.web3Provider);
        tester = true;
        document.getElementById("tester").style.display = "block";
        document.getElementById("transactionButton").style.display = "none";
        return App.initContract();
    }
},
    
initContract: function() {
    document.getElementById("account").innerHTML = account;
    const MyContract = web3.eth.contract([{
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_forwardAddress",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "_forwardFunds",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_amountToSeller",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_amountToBuyer",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_paymentToSeller",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_paymentToBuyer",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "arbitrateEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "CancelLimitBuy",
                                          "outputs": [],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "CancelLimitSell",
                                          "outputs": [],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_numTokens",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "claimTokens",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_seller",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_buyer",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_arbiter",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_price",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_percentUpFront",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_taxIncluded",
                                                     "type": "bool"
                                                     }
                                                     ],
                                          "name": "createEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": true,
                                          "stateMutability": "payable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "disputeEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_numOrders",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_change",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "fillBuyOrders",
                                          "outputs": [],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_numOrders",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_change",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "fillSellOrders",
                                          "outputs": [],
                                          "payable": true,
                                          "stateMutability": "payable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_price",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "PostLimitBuy",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": true,
                                          "stateMutability": "payable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_price",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "PostLimitSell",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [],
                                          "name": "register",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "releaseEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "signEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": true,
                                          "stateMutability": "payable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_to",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "transfer",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_to",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "transferOwnership",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "unDisputeEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "unReleaseEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "constant": false,
                                          "inputs": [
                                                     {
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "unSignEscrow",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "function"
                                          },
                                          {
                                          "inputs": [
                                                     {
                                                     "name": "_lbPerShare",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_initialSupply",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_limit",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_taxRate",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_taxAddress",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "name": "_seasonBeginDate",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "name": "_seasonEndDate",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "payable": false,
                                          "stateMutability": "nonpayable",
                                          "type": "constructor"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": false,
                                                     "name": "_seller",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_buyer",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_arbiter",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_price",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_percentUpFront",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_taxIncluded",
                                                     "type": "bool"
                                                     }
                                                     ],
                                          "name": "escrowFinalized",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": false,
                                                     "name": "_index",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_amountToSeller",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_amountToBuyer",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_paymentToSeller",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_paymentToBuyer",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "escrowArbitrated",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": true,
                                                     "name": "_buyer",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_value",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "boughtShares",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": true,
                                                     "name": "_seller",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_value",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "soldShares",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": true,
                                                     "name": "_registered",
                                                     "type": "address"
                                                     }
                                                     ],
                                          "name": "Register",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": true,
                                                     "name": "_from",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": true,
                                                     "name": "_to",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_value",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "Transfer",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": true,
                                                     "name": "_from",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": true,
                                                     "name": "_to",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_value",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "TransferOwnership",
                                          "type": "event"
                                          },
                                          {
                                          "anonymous": false,
                                          "inputs": [
                                                     {
                                                     "indexed": true,
                                                     "name": "_claimer",
                                                     "type": "address"
                                                     },
                                                     {
                                                     "indexed": false,
                                                     "name": "_amount",
                                                     "type": "uint256"
                                                     }
                                                     ],
                                          "name": "TokenClaim",
                                          "type": "event"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [
                                                     {
                                                     "name": "_theowner",
                                                     "type": "address"
                                                     }
                                                     ],
                                          "name": "balanceOf",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [
                                                     {
                                                     "name": "_theowner",
                                                     "type": "address"
                                                     }
                                                     ],
                                          "name": "balanceOfOwnership",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getBuyerEscrowSignatures",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getBuyOrders",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "address[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getEscrows",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "address[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "address[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "address[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getLbPerShare",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getSeasonBeginDate",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getSeasonEndDate",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getSellerEscrowSignatures",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "bool[]"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getSellOrders",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "address[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      },
                                                      {
                                                      "name": "",
                                                      "type": "uint256[]"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getSharesClaimed",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getTaxAddress",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "address"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "getTaxRate",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [
                                                     {
                                                     "name": "_address",
                                                     "type": "address"
                                                     }
                                                     ],
                                          "name": "isRegistered",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "bool"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "lbPerShare",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "limit",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "owner",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "address"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          },
                                          {
                                          "constant": true,
                                          "inputs": [],
                                          "name": "totalSupply",
                                          "outputs": [
                                                      {
                                                      "name": "",
                                                      "type": "uint256"
                                                      }
                                                      ],
                                          "payable": false,
                                          "stateMutability": "view",
                                          "type": "function"
                                          }
                                          ]);
    App.contracts.Fishare = MyContract.at(contractAddress);
    App.refresh();
    App.getTaxRate();
    return App.bindEvents();
},
    
bindEvents: function() {
    $(document).on('click', '.buy', App.Buy);
    $(document).on('click', '.refresh', App.refresh);
    $(document).on('click', '.register', App.Register);
    $(document).on('click', '.tradeBuy', App.TradeBuyView);
    $(document).on('click', '.tradeSell', App.TradeSellView);
    $(document).on('click', '.escrowBuy', App.EscrowBuyView);
    $(document).on('click', '.escrowSell', App.EscrowSellView);
    $(document).on('click', '.limitBuy', App.limitBuy);
    $(document).on('click', '.marketBuy', App.marketBuy);
    $(document).on('click', '.limitSell', App.limitSell);
    $(document).on('click', '.marketSell', App.marketSell);
    $(document).on('click', '.limitSellExecute', App.limitSellExecute);
    $(document).on('click', '.limitBuyExecute', App.limitBuyExecute);
    $(document).on('click', '.marketBuyExecute', App.marketBuyExecute);
    $(document).on('click', '.marketSellExecute', App.marketSellExecute);
    $(document).on('click', '.escrowLimitBuy', App.EscrowLimitBuy);
    $(document).on('click', '.escrowMarketBuy', App.EscrowMarketBuy);
    $(document).on('click', '.escrowLimitSell', App.EscrowLimitSell);
    $(document).on('click', '.escrowMarketSell', App.EscrowMarketSell);
    $(document).on('click', '.escrowLimitSellExecute', App.EscrowLimitSellExecute);
    $(document).on('click', '.escrowLimitBuyButton', App.EscrowLimitBuyExecute);
    $(document).on('click', '.escrowMarketBuyExecute', App.EscrowMarketBuyExecute);
    $(document).on('click', '.escrowMarketSellExecute', App.EscrowMarketSellExecute);
    $(document).on('click', '.ownershipTransferButton', App.TransferOwnership);
    $(document).on('click', '.transfer', App.Transfer);
    $(document).on('click', '.transactionButton', App.showTransactionHistory);
    $(document).on('click', '.viewAccountonEtherscan', App.showAccountOnEtherescan);
},
refresh: function() {
    App.contracts.Fishare.isRegistered(account, (err, result) => {
                                       if(result == true){
                                       document.getElementById("registrationstatus").innerHTML = "registered";
                                       } else document.getElementById("registrationstatus").innerHTML = "unregistered";
                                       });
    App.contracts.Fishare.getSharesClaimed((err, ClaimedShares) => {
                                           document.getElementById("available").innerHTML = 1000000-ClaimedShares;
                                           });
    App.contracts.Fishare.balanceOf(account, (err, result) => {
                                    document.getElementById("shareBalance").innerHTML = result;
                                    });
    web3.eth.getBalance(account, function (error, balance) {
                        document.getElementById("etherBalance").innerHTML = balance/1000000000000000000;
                        });
    App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                             document.getElementById("numFishOwn").innerHTML = balance;
                                             });
    App.fishTransactions();
    App.shareTransactions();
    App.makeTableScroll();
    App.getOrders();
    App.getEscrowOrders();
    App.getTaxAddress();
},
getFishTrans: function(i, eventResult){
    web3.eth.getBlock(eventResult.blockNumber, function (err, res){
                      //alert(res.timestamp);
                      var d = new Date((res.timestamp)*1000);
                      // alert(JSON.stringify(eventResult[i]));
                      // alert(JSON.stringify(eventResult[i].args));
                      var table = document.getElementById("transactionTable");
                      var row = table.insertRow(-1);
                      row.id = 'transRow' + i;
                      row.class = "white";
                      var cell1 = row.insertCell(0);
                      var cell2 = row.insertCell(1);
                      var cell3 = row.insertCell(2);
                      var cell4 = row.insertCell(3);
                      var cell5 = row.insertCell(4);
                      var cell6 = row.insertCell(5);
                      var date = d.toUTCString();
                      var dateArray = date.split('');
                      dateArray.splice(date.indexOf('GMT') - 4);
                      var shortDate = dateArray.join('');
                      cell1.innerHTML = shortDate.slice(4);
                      cell1.style.textAlign = "left";
                      cell1.style.width = "24%";
                      cell2.innerHTML = "Buy";
                      cell2.style.textAlign = "left";
                      cell2.style.width = "10%";
                      cell3.innerHTML = "Fish";
                      cell3.style.textAlign = "left";
                      cell3.style.width = "10%";
                      cell4.innerHTML = eventResult.args._amount;
                      cell4.style.textAlign = "left";
                      cell4.style.width = "10%";
                      cell5.innerHTML = eventResult.args._price;
                      cell5.style.textAlign = "left";
                      cell5.style.width = "15%";
                      var btn = document.createElement('input');
                      btn.type = "button";
                      btn.className = "tableBtn";
                      btn.value = "details";
                      btn.onclick = showTransModal(d.toUTCString(), eventResult.transactionHash, eventResult.event, eventResult.args);
                      cell6.appendChild(btn);
                      cell6.style.textAlign = "center";
                      cell6.style.width = "15%";
                      });
},
getShareTrans: function(i, eventResult, callback){
    web3.eth.getBlock(eventResult.blockNumber, function (err, res){
                      var d = new Date((res.timestamp)*1000);
                      var table = document.getElementById("transactionTable");
                      var row = table.insertRow(-1);
                      row.id = 'transRow' + i;
                      var cell1 = row.insertCell(0);
                      var cell2 = row.insertCell(1);
                      var cell3 = row.insertCell(2);
                      var cell4 = row.insertCell(3);
                      var cell5 = row.insertCell(4);
                      var cell6 = row.insertCell(5);
                      var date = d.toUTCString();
                      var dateArray = date.split('');
                      dateArray.splice(date.indexOf('GMT') - 4);
                      var shortDate = dateArray.join('');
                      cell1.innerHTML = shortDate.slice(4);
                      cell1.style.textAlign = "left";
                      cell1.style.width = "24%";
                      if(eventResult.args._seller == account){
                      cell2.innerHTML = "Sell";
                      } else if(eventResult.args._buyer == account){
                      cell2.innerHTML = "Buy";
                      };
                      cell2.style.textAlign = "left";
                      cell2.style.width = "10%";
                      cell3.innerHTML = "Shares";
                      cell3.style.textAlign = "left";
                      cell3.style.width = "10%";
                      cell4.innerHTML = eventResult.args._amount;
                      cell4.style.textAlign = "left";
                      cell4.style.width = "10%";
                      cell5.innerHTML = eventResult.args._value;
                      cell5.style.textAlign = "left";
                      cell5.style.width = "15%";
                      
                      var btn = document.createElement('input');
                      btn.type = "button";
                      btn.className = "tableBtn";
                      btn.value = "details";
                      btn.onclick = showTransModal(d.toUTCString(), eventResult.transactionHash, eventResult.event, eventResult.args);
                      cell6.appendChild(btn);
                      cell6.style.textAlign = "center";
                      cell6.style.width = "15%";
                      });
},
transDetails: function(Date, buyer, seller, Amount, price, percentUpFront, arbiter, taxIncluded){
    + "/n" +
    alert(Date + "/n" + buyer+ "/n" +  seller + "/n" + Amount+ "/n" +  price+ "/n" +  percentUpFront+ "/n" +  arbiter+ "/n" + taxIncluded);
},
Register: function(event) {
    event.preventDefault();
    App.contracts.Fishare.isRegistered(account, (err, result) => {
                                       if(result == true){
                                       alert("you are already registered");
                                       } else
                                       
                                       if(tester){
                                       web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                    var data = App.contracts.Fishare.register.getData();
                                                                    var tx = new ethereumjs.Tx({
                                                                                               nonce: nonce,
                                                                                               gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                               gasLimit: 100000,
                                                                                               from: account,
                                                                                               to: contractAddress,
                                                                                               value: 0,
                                                                                               data: data,
                                                                                               });
                                                                    tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                    var raw = '0x' + tx.serialize().toString('hex');
                                                                    web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                if(err){ alert(err)} else{
                                                                                                App.pendingAndConfirmationModals(txnHash);
                                                                                                };
                                                                                                });
                                                                    });
                                       } else {
                                       App.contracts.Fishare.register({from: account, gas: 100000}, (err, txnHash) => {
                                                                      if(err){ alert(err)} else{
                                                                      App.pendingAndConfirmationModals(txnHash);
                                                                      };
                                                                      });
                                       };
                                       });
},
Buy: function(event) {
    event.preventDefault();
    var shares = document.getElementById("shares").value;
    if(shares <= 0){
        alert("Please specificy the number of shares to claim");
    } else {
        App.contracts.Fishare.limit((err, limit) => {
                                    App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                                       if(result == true){
                                                                       App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                                                       if(parseInt(balance) + parseInt(shares)>limit){
                                                                                                       alert("You cannot exceed the limit of 1000 lbs");
                                                                                                       return;
                                                                                                       } else
                                                                                                       if(tester){
                                                                                                       web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                                                                                    var data = App.contracts.Fishare.claimTokens.getData(shares);
                                                                                                                                    var tx = new ethereumjs.Tx({
                                                                                                                                                               nonce: nonce,
                                                                                                                                                               gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                                                                               gasLimit: 800000,
                                                                                                                                                               from: account,
                                                                                                                                                               to: contractAddress,
                                                                                                                                                               value: 0,
                                                                                                                                                               data: data,
                                                                                                                                                               });
                                                                                                                                    tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                                                                                    var raw = '0x' + tx.serialize().toString('hex');
                                                                                                                                    web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                                                                                if(err){ alert(err)} else{
                                                                                                                                                                App.pendingAndConfirmationModals(txnHash);
                                                                                                                                                                }
                                                                                                                                                                });
                                                                                                                                    });
                                                                                                       } else {
                                                                                                       App.contracts.Fishare.claimTokens(shares, {from: account, gas: 800000}, (err, txnHash) => {
                                                                                                                                         App.pendingAndConfirmationModals(txnHash);
                                                                                                                                         });
                                                                                                       };
                                                                                                       });
                                                                       } else alert("You are not registered");
                                                                       });
                                    
                                    });
    };
    
},
TradeBuyView: function(event) {
    event.preventDefault();
    var BuycontentId = document.getElementById("idbuy");
    BuycontentId.style.display = "block";
    var SellcontentId = document.getElementById("idsell");
    SellcontentId.style.display = "none";
    var marketSelldisplay = document.getElementById("idlimitbuy");
    marketSelldisplay.style.display = "none";
    if (totalSellOrders == 0 || isNaN(totalSellOrders)){
        var property = document.getElementById("idmarketbuyNO");
        property.style.display = "block";
        var property = document.getElementById("idmarketbuy");
        property.style.display = "none";
    } else {
        var property = document.getElementById("idmarketbuyNO");
        property.style.display = "none";
        var property = document.getElementById("idmarketbuy");
        property.style.display = "block";
    }
    App.getOrders();
},
TradeSellView: function(event) {
    event.preventDefault();
    var SellcontentId = document.getElementById("idsell");
    SellcontentId.style.display = "block";
    var BuycontentId = document.getElementById("idbuy");
    BuycontentId.style.display = "none";
    var marketSelldisplay = document.getElementById("idlimitsell");
    marketSelldisplay.style.display = "none";
    if (totalBuyOrders == 0 || isNaN(totalBuyOrders)){
        var property = document.getElementById("idmarketsellNO");
        property.style.display = "block";
        var property = document.getElementById("idmarketsell");
        property.style.display = "none";
    } else {
        var property = document.getElementById("idmarketsellNO");
        property.style.display = "none";
        var property = document.getElementById("idmarketsell");
        property.style.display = "block";
    }
    App.getOrders();
},
Transfer: function(event){
    event.preventDefault();
    var shares = document.getElementById("transfershares").value;
    var addressTo = document.getElementById("transferaddress").value;
    if(web3.isAddress(addressTo)){
        App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                        if(parseInt(balance) < parseInt(shares)){
                                        alert("You do not have enough shares to transfer");
                                        return;
                                        } else
                                        if(tester){
                                        web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                     var data = App.contracts.Fishare.transfer.getData(addressTo, shares);
                                                                     var tx = new ethereumjs.Tx({
                                                                                                nonce: nonce,
                                                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                gasLimit: 100000,
                                                                                                from: account,
                                                                                                to: contractAddress,
                                                                                                value: 0,
                                                                                                data: data,
                                                                                                });
                                                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                     var raw = '0x' + tx.serialize().toString('hex');
                                                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                 if(err){ alert(err)} else{
                                                                                                 App.pendingAndConfirmationModals(txnHash);
                                                                                                 }
                                                                                                 });
                                                                     });
                                        } else {
                                        App.contracts.Fishare.isRegistered(addressTo, (err, result) => {
                                                                           if(result == false){
                                                                           alert("Address to transfer shares to is not registered.");
                                                                           } else App.contracts.Fishare.transfer(addressTo, shares, {from: account, gas: 100000}, (err, txnHash) => {
                                                                                                                 App.pendingAndConfirmationModals(txnHash);
                                                                                                                 });
                                                                           });
                                        };
                                        });
    } else {
        alert("Invalid Address");
    }
    
    
},
TransferOwnership: function(event){
    event.preventDefault();
    var numTransfer = document.getElementById("transferOwnership").value;
    var addressTo = document.getElementById("transferOwnershipAddress").value;
    if(web3.isAddress(addressTo)){
        App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                                 if(parseInt(balance) < parseInt(numTransfer)){
                                                 alert("You do not own enough fish to transfer");
                                                 return;
                                                 } else
                                                 if(tester){
                                                 web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                              var data = App.contracts.Fishare.transferOwnership.getData(addressTo, numTransfer);
                                                                              var tx = new ethereumjs.Tx({
                                                                                                         nonce: nonce,
                                                                                                         gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                         gasLimit: 100000,
                                                                                                         from: account,
                                                                                                         to: contractAddress,
                                                                                                         value: 0,
                                                                                                         data: data,
                                                                                                         });
                                                                              tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                              var raw = '0x' + tx.serialize().toString('hex');
                                                                              web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                          if(err){ alert(err)} else{
                                                                                                          App.pendingAndConfirmationModals(txnHash);}
                                                                                                          });
                                                                              });
                                                 } else {
                                                 App.contracts.Fishare.transferOwnership(addressTo, numTransfer, {from: account, gas: 100000}, (err, txnHash) => {
                                                                                         App.pendingAndConfirmationModals(txnHash);
                                                                                         });
                                                 };
                                                 });
    } else {
        alert("Invalid Address");
    }
},
calcBuyMarketPrice: function(){
    var shares = document.getElementById("marketBuyShares").value;
    var sharesRemaining = shares;
    var totalCost = 0;
    if(shares > totalSellOrders){
        alert("The total shares for sale is " + totalSellOrders);
        document.getElementById("marketBuyShares").value = totalSellOrders;
    } else {
        App.contracts.Fishare.getSellOrders((err, Orders) => {
                                            sellOrderAmounts = Orders[1];
                                            sellOrderPrices = Orders[2];
                                            for (var i = sellOrderAmounts.length - 1; i >= 0; i--) {
                                            if(parseInt(sharesRemaining) >= sellOrderAmounts[i]){
                                            sharesRemaining = sharesRemaining - sellOrderAmounts[i];
                                            totalCost = totalCost + sellOrderAmounts[i]*sellOrderPrices[i];
                                            } else {
                                            totalCost += sharesRemaining*sellOrderPrices[i];
                                            break;
                                            }
                                            };
                                            if(shares == null || shares.length == 0){
                                            document.getElementById("marketprice1").innerHTML = sellOrderPrices[sellOrderPrices.length - 1] + " Wei";
                                            document.getElementById("marketBuyCost").innerHTML = totalCost;
                                            return;
                                            }
                                            document.getElementById("marketprice1").innerHTML = (totalCost/shares).toFixed(2) + " Wei";
                                            document.getElementById("marketBuyCost").innerHTML = totalCost;
                                            });
    }
},
calcSellMarketPrice: function(){
    var shares = document.getElementById("marketSellShares").value;
    var sharesRemaining = shares;
    var totalCost = 0;
    if(shares > totalBuyOrders){
        alert("The total number of shares to buy is " + totalBuyOrders);
        document.getElementById("marketSellShares").value = totalBuyOrders;
    } else {
        App.contracts.Fishare.getBuyOrders((err, Orders) => {
                                           buyOrderAmounts = Orders[1];
                                           buyOrderPrices = Orders[2];
                                           for (var i = buyOrderAmounts.length - 1; i >= 0; i--) {
                                           if(parseInt(sharesRemaining) > buyOrderAmounts[i]){
                                           sharesRemaining = sharesRemaining - buyOrderAmounts[i];
                                           totalCost = totalCost + buyOrderAmounts[i]*buyOrderPrices[i];
                                           } else {
                                           totalCost += sharesRemaining*buyOrderPrices[i];
                                           break;
                                           }
                                           };
                                           if(shares == null || shares.length == 0){
                                           document.getElementById("marketprice2").innerHTML = buyOrderPrices[buyOrderPrices.length - 1] + " Wei";
                                           document.getElementById("marketSellValue").innerHTML = totalCost;
                                           return;
                                           }
                                           document.getElementById("marketprice2").innerHTML = (totalCost/shares).toFixed(2) + " Wei";
                                           document.getElementById("marketSellValue").innerHTML = totalCost;
                                           });
    }
},
limitBuy: function(event){
    var property = document.getElementById("limitBuy");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("marketBuy");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    var marketBuydisplay = document.getElementById("idlimitbuy");
    marketBuydisplay.style.display = "block";
    var marketBuydisplay = document.getElementById("idmarketbuy");
    marketBuydisplay.style.display = "none";
    var property = document.getElementById("idmarketbuyNO");
    property.style.display = "none";
},
marketBuy: function(event){
    var marketBuydisplay = document.getElementById("idlimitbuy");
    marketBuydisplay.style.display = "none";
    if (totalSellOrders == 0 || isNaN(totalSellOrders)){
        var property = document.getElementById("idmarketbuyNO");
        property.style.display = "block";
        var property = document.getElementById("idmarketbuy");
        property.style.display = "none";
    } else {
        var property = document.getElementById("idmarketbuyNO");
        property.style.display = "none";
        var property = document.getElementById("idmarketbuy");
        property.style.display = "block";
    }
    var property = document.getElementById("marketBuy");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("limitBuy");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    
},
limitSell: function(event){
    var property = document.getElementById("limitSell");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("marketSell");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    var marketSelldisplay = document.getElementById("idmarketsell");
    marketSelldisplay.style.display = "none";
    var marketSelldisplay = document.getElementById("idlimitsell");
    marketSelldisplay.style.display = "block";
    var property = document.getElementById("idmarketsellNO");
    property.style.display = "none";
},
marketSell: function(event){
    event.preventDefault();
    var marketSelldisplay = document.getElementById("idlimitsell");
    marketSelldisplay.style.display = "none";
    if (totalBuyOrders == 0 || isNaN(totalBuyOrders)){
        var property = document.getElementById("idmarketsellNO");
        property.style.display = "block";
        var property = document.getElementById("idmarketsell");
        property.style.display = "none";
    } else {
        var property = document.getElementById("idmarketsellNO");
        property.style.display = "none";
        var property = document.getElementById("idmarketsell");
        property.style.display = "block";
    }
    var property = document.getElementById("marketSell");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("limitSell");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
},
limitSellExecute: function(event){
    var sellPrice = document.getElementById("limitSellPrice").value;
    var numShares = document.getElementById("limitSellShares").value;
    if(numShares <= 0){
        alert("Invalid number");
    } else
        App.contracts.Fishare.isRegistered(account, (err, result) => {
                                           if(result == true){
                                           App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                           if(parseInt(numShares) > parseInt(balance)){
                                                                           alert("Your balance is: " + balance);
                                                                           return;
                                                                           } else
                                                                           if(tester){
                                                                           web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                                                        var data = App.contracts.Fishare.PostLimitSell.getData(numShares, sellPrice);
                                                                                                        var tx = new ethereumjs.Tx({
                                                                                                                                   nonce: nonce,
                                                                                                                                   gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                                                   gasLimit: 200000,
                                                                                                                                   from: account,
                                                                                                                                   to: contractAddress,
                                                                                                                                   value: 0,
                                                                                                                                   data: data,
                                                                                                                                   });
                                                                                                        tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                                                        var raw = '0x' + tx.serialize().toString('hex');
                                                                                                        web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                                                    if(err){ alert(err)} else{
                                                                                                                                    App.pendingAndConfirmationModals(txnHash);}
                                                                                                                                    });
                                                                                                        });
                                                                           } else {
                                                                           App.contracts.Fishare.PostLimitSell(numShares, sellPrice, {from: account, gas: 200000}, (err, txnHash) => {
                                                                                                               App.pendingAndConfirmationModals(txnHash);
                                                                                                               });
                                                                           };
                                                                           });
                                           } else alert("You are not registered");
                                           });
    
},
marketBuyExecute: function(event){
    var numShares = document.getElementById("marketBuyShares").value;
    var sharesToFillRemaining = numShares;
    var numOrdersToFill = 0;
    var change = 0;
    var payment = 0;
    var sellOrderAddresses;
    var sellOrderAmounts;
    var sellOrderPrices;
    if(numShares <= 0){
        alert("Invalid number");
    } else
        App.contracts.Fishare.isRegistered(account, (err, result) => {
                                           if(result == true){
                                           App.contracts.Fishare.getSellOrders((err, Orders) => {
                                                                               sellOrderAddresses = Orders[0];
                                                                               sellOrderAmounts = Orders[1];
                                                                               sellOrderPrices = Orders[2];
                                                                               for (var i = sellOrderAmounts.length - 1; i >= 0; i--) {
                                                                               if(parseInt(sharesToFillRemaining) >= sellOrderAmounts[i]){
                                                                               numOrdersToFill++;
                                                                               sharesToFillRemaining = sharesToFillRemaining - sellOrderAmounts[i];
                                                                               payment += sellOrderAmounts[i]*sellOrderPrices[i];
                                                                               } else {
                                                                               numOrdersToFill++;
                                                                               change = sellOrderAmounts[i] - sharesToFillRemaining;
                                                                               sharesToFillRemaining = 0;
                                                                               payment += (sellOrderAmounts[i]-change)*sellOrderPrices[i];
                                                                               break;
                                                                               }
                                                                               };
                                                                               App.fillSellOrders(numOrdersToFill, change, payment);
                                                                               });
                                           } else alert("You are not registered");
                                           });
},
fillSellOrders: function(numOrdersToFill, change, payment){
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.fillSellOrders.getData(numOrdersToFill, change);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 700000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: payment,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        
        App.contracts.Fishare.fillSellOrders(numOrdersToFill, change, {from: account, gas: 700000, value: payment}, (err, txnHash) => {
                                             App.pendingAndConfirmationModals(txnHash);
                                             });
        
        
    };
},
marketSellExecute: function(event){
    var numShares = document.getElementById("marketSellShares").value;
    var sharesToFillRemaining = numShares;
    var numOrdersToFill = 0;
    var change = 0;
    var buyOrderAddresses;
    var buyOrderAmounts;
    var buyOrderPrices;
    App.contracts.Fishare.getBuyOrders((err, Orders) => {
                                       buyOrderAddresses = Orders[0];
                                       buyOrderAmounts = Orders[1];
                                       buyOrderPrices = Orders[2];
                                       for (var i = buyOrderAmounts.length - 1; i >= 0; i--) {
                                       if(parseInt(sharesToFillRemaining) >= buyOrderAmounts[i]){
                                       numOrdersToFill++;
                                       sharesToFillRemaining = sharesToFillRemaining - buyOrderAmounts[i];
                                       } else {
                                       numOrdersToFill++;
                                       change = buyOrderAmounts[i] - sharesToFillRemaining;
                                       sharesToFillRemaining = 0;
                                       break;
                                       }
                                       };
                                       App.fillBuyOrders(numOrdersToFill, change);
                                       });
},
fillBuyOrders: function(numOrdersToFill, change){
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.fillBuyOrders.getData(numOrdersToFill, change);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 700000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.fillBuyOrders(numOrdersToFill, change, {from: account, gas: 700000}, (err, txnHash) => {
                                            App.pendingAndConfirmationModals(txnHash);
                                            });
    };
},
limitBuyExecute: function(event){
    var price = document.getElementById("limitBuyPrice").value;
    var shares = document.getElementById("limitBuyShares").value;
    var cost = shares*price;
    if(price.length == 0){
        alert("Price is blank");
    } else if(shares.length == 0){
        alert("Number of shares to buy is blank");
    } else {
        App.contracts.Fishare.isRegistered(account, (err, result) => {
                                           if(result == true){
                                           App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                           if(parseInt(balance) + parseInt(shares)>1000){
                                                                           alert("You cannot exceed the limit of 1000 lbs");
                                                                           return;
                                                                           } else
                                                                           if(tester){
                                                                           web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                                                        var data = App.contracts.Fishare.PostLimitBuy.getData(shares, price);
                                                                                                        var tx = new ethereumjs.Tx({
                                                                                                                                   nonce: nonce,
                                                                                                                                   gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                                                   gasLimit: 2000000,
                                                                                                                                   from: account,
                                                                                                                                   to: contractAddress,
                                                                                                                                   value: cost,
                                                                                                                                   data: data,
                                                                                                                                   });
                                                                                                        tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                                                        var raw = '0x' + tx.serialize().toString('hex');
                                                                                                        web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                                                    if(err){ alert(err)} else{
                                                                                                                                    App.pendingAndConfirmationModals(txnHash);}
                                                                                                                                    });
                                                                                                        });
                                                                           } else {
                                                                           App.contracts.Fishare.PostLimitBuy(shares, price, {from: account, gas: 200000, value: cost}, (err, txnHash) => {
                                                                                                              App.pendingAndConfirmationModals(txnHash);
                                                                                                              });
                                                                           };
                                                                           });
                                           } else alert("You are not registered");
                                           });
    };
},
getOrders: function(event, accounts){
    var addresses;
    var amounts;
    var prices;
    
    var addressesArray;
    var amountsArray;
    var pricesArray;
    
    var table = document.getElementById("orderTable");
    var orderTableCounter = 0;
    var orderChart = document.getElementById('yourOrders');
    orderChart.style.display = 'none';
    
    var ctx = document.getElementById("shareOrderChart").getContext('2d');
    var chartOrders = [];
    var chart = new Chart(ctx, {
                          type: 'bar',
                          data: {
                          labels: [],
                          datasets: [{
                                     
                                     backgroundColor: [],
                                     borderColor: 'rgb(255, 99, 132)',
                                     data: [],
                                     }]
                          },
                          options: {
                          legend: {
                          display: false
                          },
                          scales: {
                          yAxes: [{
                                  ticks: {
                                  beginAtZero: true
                                  }
                                  }],
                          xAxes: [{
                                  categoryPercentage: 1.0,
                                  barPercentage: 1.0
                                  }]
                          }
                          }
                          });
    
    
    //set market price for buying if there are posted limit sell orders
    //set market price for selling if there are posted limit buy orders
    App.contracts.Fishare.getBuyOrders((err, Orders) => {
                                       if (Orders.length != 0){
                                       buyMarketPrice = 0;
                                       totalBuyOrders = 0;
                                       addresses = Orders[0].toString();
                                       addressesArray = addresses.split(',');
                                       amounts = Orders[1].toString();
                                       var chartOrders = [];
                                       var chartOrderLabels = [];
                                       amountsArray = amounts.split(',');
                                       prices = Orders[2].toString();
                                       pricesArray = prices.split(',');
                                       for (var i = 0; i < amountsArray.length ; i++) {
                                       chartOrders = chartOrders.concat(parseInt(amountsArray[i]));
                                       chartOrderLabels = chartOrderLabels.concat(pricesArray[i]);
                                       chart.data.datasets[0].backgroundColor = chart.data.datasets[0].backgroundColor.concat("green");
                                       if (pricesArray[i] > buyMarketPrice){
                                       buyMarketPrice = pricesArray[i];
                                       }
                                       totalBuyOrders = totalBuyOrders + parseInt(amountsArray[i]);
                                       if(addressesArray[i].toUpperCase() == String(account).toUpperCase()){
                                       if (orderTableCounter < accountOrderLength){
                                       var row = document.getElementById('BuyRow' + i);
                                       row.childNodes[0].innerHTML = "Buy";
                                       row.childNodes[1].innerHTML = amountsArray[i];
                                       row.childNodes[2].innerHTML = pricesArray[i];
                                       } else {
                                       var row = table.insertRow(-1);
                                       row.id = 'BuyRow' + i;
                                       var cell1 = row.insertCell(0);
                                       var cell2 = row.insertCell(1);
                                       var cell3 = row.insertCell(2);
                                       var cell4 = row.insertCell(3);
                                       cell1.innerHTML = "Buy";
                                       cell1.style.textAlign = "center";
                                       cell2.innerHTML = amountsArray[i];
                                       cell2.style.textAlign = "center";
                                       cell3.innerHTML = pricesArray[i];
                                       cell3.style.textAlign = "center";
                                       var btn = document.createElement('input');
                                       btn.type = "button";
                                       btn.className = "tableBtn";
                                       btn.value = "delete";
                                       btn.onclick = cancelBuyOrder(i);
                                       cell4.appendChild(btn);
                                       cell4.style.textAlign = "center";
                                       accountOrderLength++;
                                       }
                                       orderTableCounter++;
                                       }
                                       
                                       };
                                       chart.data.labels = chart.data.labels.concat(chartOrderLabels);
                                       chart.data.datasets[0].data = chart.data.datasets[0].data.concat(chartOrders);
                                       chart.update();
                                       };
                                       App.contracts.Fishare.getSellOrders((err, Orders) => {
                                                                           sellMarketPrice = 0;
                                                                           totalSellOrders = 0;
                                                                           addresses = Orders[0].toString();
                                                                           addressesArray = addresses.split(',');
                                                                           amounts = Orders[1].toString();
                                                                           var OrdersRev = [];
                                                                           var OrderLabelsRev = [];
                                                                           
                                                                           amountsArray = amounts.split(',')
                                                                           prices = Orders[2].toString();
                                                                           pricesArray = prices.split(',')
                                                                           for (var i = 0; i < amountsArray.length ; i++) {
                                                                           OrdersRev = OrdersRev.concat(parseInt(amountsArray[i]));
                                                                           OrderLabelsRev = OrderLabelsRev.concat(pricesArray[i]);
                                                                           chart.data.datasets[0].backgroundColor = chart.data.datasets[0].backgroundColor.concat("red");
                                                                           
                                                                           if (pricesArray[i] < sellMarketPrice){
                                                                           sellMarketPrice = pricesArray[i];
                                                                           }
                                                                           
                                                                           totalSellOrders = totalSellOrders + parseInt(amountsArray[i]);
                                                                           if(addressesArray[i].toUpperCase() == String(account).toUpperCase()){
                                                                           if (orderTableCounter < accountOrderLength){
                                                                           var row = document.getElementById('SellRow' + i);
                                                                           row.childNodes[0].innerHTML = "Sell";
                                                                           row.childNodes[1].innerHTML = amountsArray[i];
                                                                           row.childNodes[2].innerHTML = pricesArray[i];
                                                                           } else {
                                                                           var row = table.insertRow(-1);
                                                                           row.id = 'SellRow' + i;
                                                                           var cell1 = row.insertCell(0);
                                                                           var cell2 = row.insertCell(1);
                                                                           var cell3 = row.insertCell(2);
                                                                           var cell4 = row.insertCell(3);
                                                                           cell1.innerHTML = "Sell";
                                                                           cell1.style.textAlign = "center";
                                                                           cell2.innerHTML = amountsArray[i];
                                                                           cell2.style.textAlign = "center";
                                                                           cell3.innerHTML = pricesArray[i];
                                                                           cell3.style.textAlign = "center";
                                                                           var btn = document.createElement('input');
                                                                           btn.type = "button";
                                                                           btn.className = "tableBtn";
                                                                           btn.value = "delete";
                                                                           btn.onclick = cancelSellOrder(i);
                                                                           cell4.appendChild(btn);
                                                                           cell4.style.textAlign = "center";
                                                                           accountOrderLength++;
                                                                           }
                                                                           orderTableCounter++;
                                                                           }
                                                                           };
                                                                           if (accountOrderLength > 0){
                                                                           orderChart.style.display = 'block';
                                                                           document.getElementById("noShareOrderText").value = "All Orders:";
                                                                           } else {
                                                                           orderChart.style.display = 'none';
                                                                           document.getElementById("noShareOrderText").style.display = 'none';
                                                                           };
                                                                           if(totalBuyOrders > 0 || totalSellOrders > 0){
                                                                           
                                                                           document.getElementById("orderChart").style.display = 'block';
                                                                           } else {
                                                                           document.getElementById("orderChart").style.display = 'none';
                                                                           document.getElementById("noShareOrderText").value = "No Orders";
                                                                           }
                                                                           
                                                                           chart.data.labels = chart.data.labels.concat(OrderLabelsRev.reverse());
                                                                           chart.data.datasets[0].data = chart.data.datasets[0].data.concat(OrdersRev.reverse());
                                                                           chart.update();
                                                                           });
                                       });
    
    
},
removeBuyOrder: function(arg){
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.CancelLimitBuy.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 100000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.CancelLimitBuy(arg, {from: account, gas: 100000}, (err, txnHash) => {
                                             App.pendingAndConfirmationModals(txnHash);
                                             });
    };
    
},
removeSellOrder: function(arg){
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.CancelLimitSell.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 100000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.CancelLimitSell(arg, {from: account, gas: 100000}, (err, txnHash) => {
                                              App.pendingAndConfirmationModals(txnHash);
                                              });
    };
},
EscrowBuyView: function(event) {
    App.EscrowMarketBuy();
},
EscrowSellView: function(event) {
    App.EscrowMarketSell();
},
EscrowLimitBuy: function(event){
    var property = document.getElementById("escrowLimitBuy");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("escrowMarketBuy");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    var marketBuydisplay = document.getElementById("idEscrowLimitbuy");
    marketBuydisplay.style.display = "block";
    document.getElementById("openEscrowOrders").style.display = 'none';
    var property = document.getElementById("idEscrowMarketBuyNO");
    property.style.display = "none";
},
EscrowMarketBuy: function(event){
    document.getElementById("idEscrowLimitbuy").style.display = "none";
    document.getElementById("idEscrowBuy").style.display = "block";
    document.getElementById("idEscrowSell").style.display = "none";
    var property = document.getElementById("escrowMarketBuy");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("escrowLimitBuy");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    
    var sellers;
    var buyers;
    var arbiters;
    var prices;
    var amounts;
    var percentsUpFront;
    var taxIncluded;
    
    var sellersArray;
    var buyersArray;
    var arbitersArray;
    var pricesArray;
    var amountsArray;
    var percentsUpFrontArray;
    var taxIncludedArray;
    
    blankAddress = "0X0000000000000000000000000000000000000000";
    
    document.getElementById("escrowOpenSellOrderTableVis").style.display = 'none';
    document.getElementById("escrowOpenBuyOrderTableVis").style.display = 'block';
    var table = document.getElementById("escrowOpenBuyOrderTable");
    var escrowOpenOrderTableCounter = 0;
    //set market price for selling if there are posted limit buy orders
    App.contracts.Fishare.getEscrows({from: account},(err, Orders) => {
                                     sellers = Orders[0].toString();
                                     sellersArray = sellers.split(',');
                                     buyers = Orders[1].toString();
                                     buyersArray = buyers.split(',');
                                     arbiters = Orders[2].toString();
                                     arbitersArray = arbiters.split(',');
                                     prices = Orders[3].toString();
                                     pricesArray = prices.split(',');
                                     amounts = Orders[4].toString();
                                     amountsArray = amounts.split(',');
                                     percentsUpFront = Orders[5].toString();
                                     percentsUpFrontArray = percentsUpFront.split(',');
                                     taxIncluded = Orders[6].toString();
                                     taxIncludedArray = taxIncluded.split(',');
                                     App.contracts.Fishare.getSellerEscrowSignatures({from: account},(err, OrderSellerSigs) => {
                                                                                     var sellerSigned = OrderSellerSigs[0];
                                                                                     var sellerUnSigned = OrderSellerSigs[1];
                                                                                     var  sellerReleased = OrderSellerSigs[2];
                                                                                     var sellerDisputed = OrderSellerSigs[3];
                                                                                     App.contracts.Fishare.getBuyerEscrowSignatures({from: account},(err, OrderBuyerSigs) => {
                                                                                                                                    var buyerSigned = OrderBuyerSigs[0];
                                                                                                                                    var buyerUnSigned = OrderBuyerSigs[1];
                                                                                                                                    var  buyerReleased = OrderBuyerSigs[2];
                                                                                                                                    var buyerDisputed = OrderBuyerSigs[3];
                                                                                                                                    for (var i = 0; i < amountsArray.length ; i++) {
                                                                                                                                    if(sellersArray[i].toUpperCase() != String(account).toUpperCase() && buyersArray[i].toUpperCase() != String(account).toUpperCase() && buyersArray[i].toUpperCase() == blankAddress){
                                                                                                                                    totalEscrowOpenSellOrders++;
                                                                                                                                    if (escrowOpenOrderTableCounter < escrowOpenOrderLength){
                                                                                                                                    var row = document.getElementById('EscrowOpenOrderRow' + i);
                                                                                                                                    row.childNodes[0].innerHTML = i;
                                                                                                                                    if(sellersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != buyersArray[i].toUpperCase() && sellersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    row.childNodes[1].innerHTML = "Sell";
                                                                                                                                    } else if(buyersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != sellersArray[i].toUpperCase() && buyersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    row.childNodes[1].innerHTML = "Buy";
                                                                                                                                    };
                                                                                                                                    row.childNodes[2].innerHTML = amountsArray[i];
                                                                                                                                    row.childNodes[3].innerHTML = pricesArray[i];
                                                                                                                                    row.childNodes[4].innerHTML = percentsUpFrontArray[i];
                                                                                                                                    } else {
                                                                                                                                    var row = table.insertRow(-1);
                                                                                                                                    row.id = 'EscrowOpenOrderRow' + i;
                                                                                                                                    var cell1 = row.insertCell(0);
                                                                                                                                    var cell2 = row.insertCell(1);
                                                                                                                                    var cell3 = row.insertCell(2);
                                                                                                                                    var cell4 = row.insertCell(3);
                                                                                                                                    var cell5 = row.insertCell(4);
                                                                                                                                    var cell6 = row.insertCell(5);
                                                                                                                                    
                                                                                                                                    cell1.innerHTML = i;
                                                                                                                                    cell1.style.textAlign = "center";
                                                                                                                                    if(sellersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != buyersArray[i].toUpperCase() && sellersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    cell2.innerHTML = "Sell";
                                                                                                                                    } else if(buyersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != sellersArray[i].toUpperCase() && buyersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    cell2.innerHTML = "Buy";
                                                                                                                                    };
                                                                                                                                    
                                                                                                                                    cell2.style.textAlign = "center";
                                                                                                                                    cell3.innerHTML = amountsArray[i];
                                                                                                                                    cell3.style.textAlign = "center";
                                                                                                                                    cell4.innerHTML = pricesArray[i];
                                                                                                                                    cell4.style.textAlign = "center";
                                                                                                                                    cell5.innerHTML = percentsUpFrontArray[i];
                                                                                                                                    cell5.style.textAlign = "center";
                                                                                                                                    var btn = document.createElement('input');
                                                                                                                                    btn.type = "button";
                                                                                                                                    btn.className = "tableBtn";
                                                                                                                                    btn.value = "Actions";
                                                                                                                                    btn.onclick = showEscrowActions(i, sellersArray[i], buyersArray[i], arbitersArray[i], pricesArray[i], amountsArray[i], percentsUpFrontArray[i], taxIncludedArray[i], sellerSigned[i], buyerSigned[i], sellerUnSigned[i], buyerUnSigned[i], sellerReleased[i], buyerReleased[i], buyerDisputed[i], sellerDisputed[i]);
                                                                                                                                    cell6.appendChild(btn);
                                                                                                                                    cell6.style.textAlign = "center";
                                                                                                                                    escrowOpenOrderLength++;
                                                                                                                                    };
                                                                                                                                    escrowOpenOrderTableCounter++;
                                                                                                                                    }
                                                                                                                                    };
                                                                                                                                    if(escrowOpenOrderTableCounter == 0){
                                                                                                                                    document.getElementById("openEscrowOrders").style.display = 'none';
                                                                                                                                    } else {
                                                                                                                                    document.getElementById("openEscrowOrders").style.display = 'block';
                                                                                                                                    document.getElementById("openEscrowOrdersHeader").value = "Open Orders";
                                                                                                                                    };
                                                                                                                                    if (totalEscrowOpenSellOrders == 0){
                                                                                                                                    var property = document.getElementById("idEscrowMarketBuyNO");
                                                                                                                                    property.style.display = "block";
                                                                                                                                    
                                                                                                                                    } else {
                                                                                                                                    var property = document.getElementById("idEscrowMarketbuyNO");
                                                                                                                                    property.style.display = "none";
                                                                                                                                    };
                                                                                                                                    });
                                                                                     });
                                     
                                     
                                     
                                     });
},
EscrowLimitSell: function(event){
    document.getElementById("escrowMarketSellOnly").style.display = "none";
    var property = document.getElementById("escrowLimitSell");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("escrowMarketSell");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    document.getElementById("idEscrowLimitsell").style.display = "block";
    document.getElementById("openEscrowOrders").style.display = "none";
    document.getElementById("idEscrowMarketsellNO").style.display = "none";
},
EscrowMarketSell: function(event){
    document.getElementById("escrowMarketSellOnly").style.display = "block";
    document.getElementById("idEscrowLimitsell").style.display = "none";
    document.getElementById("idEscrowBuy").style.display = "none";
    document.getElementById("idEscrowSell").style.display = "block";
    var property = document.getElementById("escrowMarketSell");
    property.style.backgroundColor = "#273e55";
    property.style.color = "#ffffff";
    var property = document.getElementById("escrowLimitSell");
    property.style.backgroundColor = "#ffffff";
    property.style.color = "#273e55";
    
    var sellers;
    var buyers;
    var arbiters;
    var prices;
    var amounts;
    var percentsUpFront;
    var taxIncluded;
    
    var sellersArray;
    var buyersArray;
    var arbitersArray;
    var pricesArray;
    var amountsArray;
    var percentsUpFrontArray;
    var taxIncludedArray;
    
    blankAddress = "0X0000000000000000000000000000000000000000";
    
    document.getElementById("escrowOpenSellOrderTableVis").style.display = 'block';
    document.getElementById("escrowOpenBuyOrderTableVis").style.display = 'none';
    var table = document.getElementById("escrowOpenSellOrderTable");
    var escrowOpenOrderTableCounter = 0;
    //set market price for selling if there are posted limit buy orders
    App.contracts.Fishare.getEscrows({from: account},(err, Orders) => {
                                     sellers = Orders[0].toString();
                                     sellersArray = sellers.split(',');
                                     buyers = Orders[1].toString();
                                     buyersArray = buyers.split(',');
                                     arbiters = Orders[2].toString();
                                     arbitersArray = arbiters.split(',');
                                     prices = Orders[3].toString();
                                     pricesArray = prices.split(',');
                                     amounts = Orders[4].toString();
                                     amountsArray = amounts.split(',');
                                     percentsUpFront = Orders[5].toString();
                                     percentsUpFrontArray = percentsUpFront.split(',');
                                     taxIncluded = Orders[6].toString();
                                     taxIncludedArray = taxIncluded.split(',');
                                     App.contracts.Fishare.getSellerEscrowSignatures({from: account},(err, OrderSellerSigs) => {
                                                                                     var sellerSigned = OrderSellerSigs[0];
                                                                                     var sellerUnSigned = OrderSellerSigs[1];
                                                                                     var  sellerReleased = OrderSellerSigs[2];
                                                                                     var sellerDisputed = OrderSellerSigs[3];
                                                                                     App.contracts.Fishare.getBuyerEscrowSignatures({from: account},(err, OrderBuyerSigs) => {
                                                                                                                                    
                                                                                                                                    var buyerSigned = OrderBuyerSigs[0];
                                                                                                                                    var buyerUnSigned = OrderBuyerSigs[1];
                                                                                                                                    var  buyerReleased = OrderBuyerSigs[2];
                                                                                                                                    var buyerDisputed = OrderBuyerSigs[3];
                                                                                                                                    for (var i = 0; i < amountsArray.length ; i++) {
                                                                                                                                    if(sellersArray[i].toUpperCase() != String(account).toUpperCase() && buyersArray[i].toUpperCase() != String(account).toUpperCase() && sellersArray[i].toUpperCase() == blankAddress){
                                                                                                                                    
                                                                                                                                    if (escrowOpenOrderTableCounter < totalEscrowOpenBuyOrders){
                                                                                                                                    var row = document.getElementById('EscrowOpenOrderRow' + i);
                                                                                                                                    row.childNodes[0].innerHTML = i;
                                                                                                                                    
                                                                                                                                    if(sellersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != buyersArray[i].toUpperCase() && sellersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    row.childNodes[1].innerHTML = "Sell";
                                                                                                                                    } else if(buyersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != sellersArray[i].toUpperCase() && buyersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    row.childNodes[1].innerHTML = "Buy";
                                                                                                                                    };
                                                                                                                                    row.childNodes[2].innerHTML = amountsArray[i];
                                                                                                                                    row.childNodes[3].innerHTML = pricesArray[i];
                                                                                                                                    row.childNodes[4].innerHTML = percentsUpFrontArray[i];
                                                                                                                                    } else {
                                                                                                                                    var row = table.insertRow(-1);
                                                                                                                                    row.id = 'EscrowOpenOrderRow' + i;
                                                                                                                                    var cell1 = row.insertCell(0);
                                                                                                                                    var cell2 = row.insertCell(1);
                                                                                                                                    var cell3 = row.insertCell(2);
                                                                                                                                    var cell4 = row.insertCell(3);
                                                                                                                                    var cell5 = row.insertCell(4);
                                                                                                                                    var cell6 = row.insertCell(5);
                                                                                                                                    
                                                                                                                                    cell1.innerHTML = i;
                                                                                                                                    cell1.style.textAlign = "center";
                                                                                                                                    
                                                                                                                                    if(sellersArray[i] == String(account).toUpperCase() || (String(account).toUpperCase() != buyersArray[i].toUpperCase() && sellersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    cell2.innerHTML = "Sell";
                                                                                                                                    } else if(buyersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != sellersArray[i].toUpperCase() && buyersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    cell2.innerHTML = "Buy";
                                                                                                                                    };
                                                                                                                                    cell2.style.textAlign = "center";
                                                                                                                                    
                                                                                                                                    cell3.innerHTML = amountsArray[i];
                                                                                                                                    cell3.style.textAlign = "center";
                                                                                                                                    cell4.innerHTML = pricesArray[i];
                                                                                                                                    cell4.style.textAlign = "center";
                                                                                                                                    cell5.innerHTML = percentsUpFrontArray[i];
                                                                                                                                    cell5.style.textAlign = "center";
                                                                                                                                    var btn = document.createElement('input');
                                                                                                                                    btn.type = "button";
                                                                                                                                    btn.className = "tableBtn";
                                                                                                                                    btn.value = "Actions";
                                                                                                                                    btn.onclick = showEscrowActions(i, sellersArray[i], buyersArray[i], arbitersArray[i], pricesArray[i], amountsArray[i], percentsUpFrontArray[i], taxIncludedArray[i], sellerSigned[i], buyerSigned[i], sellerUnSigned[i], buyerUnSigned[i], sellerReleased[i], buyerReleased[i], buyerDisputed[i], sellerDisputed[i]);
                                                                                                                                    cell6.appendChild(btn);
                                                                                                                                    cell6.style.textAlign = "center";
                                                                                                                                    totalEscrowOpenBuyOrders++;
                                                                                                                                    };
                                                                                                                                    escrowOpenOrderTableCounter++;
                                                                                                                                    };
                                                                                                                                    };
                                                                                                                                    if(escrowOpenOrderTableCounter == 0){
                                                                                                                                    document.getElementById("openEscrowOrders").style.display = 'none';
                                                                                                                                    } else {
                                                                                                                                    document.getElementById("openEscrowOrders").style.display = 'block';
                                                                                                                                    document.getElementById("openEscrowOrdersHeader").value = "Open Orders";
                                                                                                                                    };
                                                                                                                                    if (totalEscrowOpenBuyOrders == 0){
                                                                                                                                    var property = document.getElementById("idEscrowMarketsellNO");
                                                                                                                                    property.style.display = "block";
                                                                                                                                    
                                                                                                                                    } else {
                                                                                                                                    var property = document.getElementById("idEscrowMarketsellNO");
                                                                                                                                    property.style.display = "none";
                                                                                                                                    
                                                                                                                                    };
                                                                                                                                    
                                                                                                                                    
                                                                                                                                    
                                                                                                                                    
                                                                                                                                    });
                                                                                     });
                                     
                                     
                                     
                                     });
},
getTaxRate: function(){
    App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                     document.getElementById("taxRate").value = taxRate
                                     document.getElementById("taxRate2").value = taxRate
                                     });
},
calcEscrowBuyPrice: function(){
    var totalCost = 0;
    var units = document.getElementById("escrowBuyFishAmount").value;
    var pricePerUnit = document.getElementById("escrowBuyFishPrice").value;
    var includeTax = document.getElementById("escrowBuyIncludeTax").checked;
    totalCost = units*pricePerUnit;
    if(includeTax){
        App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                         document.getElementById("escrowBuyCost").value = Math.floor((100+parseInt(taxRate))*totalCost/100);
                                         });
    } else {
        document.getElementById("escrowBuyCost").value = totalCost;
    }
    
},
EscrowLimitBuyExecute: function(event){
    var pricePerPound = document.getElementById("escrowBuyFishPrice").value;
    if (pricePerPound < 0 || pricePerPound == null || pricePerPound == "") {
        alert("Price must be greater than 0");
    };
    var pounds = document.getElementById("escrowBuyFishAmount").value;
    if (pounds < 0 || pounds == null || pounds == "") {
        alert("Amount must be greater than 0");
    };
    var cost = document.getElementById("escrowBuyCost").value/(1000000000000000000);
    var upFrontPercent = document.getElementById("escrowBuyUpFrontPercent").value;
    if (upFrontPercent > 100 || upFrontPercent < 0 || upFrontPercent == null || upFrontPercent == "") {
        alert("Up front percent must be between 0 and 100");
    };
    var sellerAddress = document.getElementById("escrowBuyingSellerAddress").value;
    if (sellerAddress == "") {
        sellerAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";
    };
    var arbiter = document.getElementById("escrowBuyArbiterAddress").value;
    if(arbiter == null || arbiter == ""){ arbiter = account };
    var includeTax = document.getElementById('escrowBuyIncludeTax').checked;
    var totalCost = 0;
    var units = document.getElementById("escrowBuyFishAmount").value;
    var pricePerUnit = document.getElementById("escrowBuyFishPrice").value;
    var includeTax = document.getElementById("escrowBuyIncludeTax").checked;
    totalCost = units*pricePerUnit;
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.createEscrow.getData(sellerAddress, account, arbiter, totalCost, pounds, upFrontPercent, includeTax);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 250000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: web3.toWei(cost, 'ether'),
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.createEscrow(sellerAddress, account, arbiter, totalCost, pounds, upFrontPercent, includeTax, {from: account, gas: 250000, value: web3.toWei(cost, 'ether')}, (err, txnHash) => {
                                           App.pendingAndConfirmationModals(txnHash);
                                           });
    };
    
},
calcEscrowSellPrice: function(){
    var totalCost = 0;
    var units = document.getElementById("escrowSellFishAmount").value;
    var pricePerUnit = document.getElementById("escrowSellFishPrice").value;
    var includeTax = document.getElementById("escrowSellIncludeTax").checked;
    totalCost = units*pricePerUnit;
    if(includeTax){
        App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                         document.getElementById("escrowSellCost").value = Math.floor((100+parseInt(taxRate))*totalCost/100);
                                         });
    } else {
        document.getElementById("escrowSellCost").value = totalCost;
    }
    
},
EscrowLimitSellExecute: function(event){
    var pricePerPound = document.getElementById("escrowSellFishPrice").value;
    var pounds = document.getElementById("escrowSellFishAmount").value;
    
    
    var cost = pounds*pricePerPound;
    var upFrontPercent = document.getElementById("escrowSellUpFrontPercent").value;
    if (upFrontPercent == null || upFrontPercent == "") {
        upFrontPercent = 0;
    };
    var buyerAddress = document.getElementById("escrowSellingBuyerAddress").value;
    if (buyerAddress == "") {
        buyerAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";
    };
    var arbiter = document.getElementById("escrowSellArbiterAddress").value;
    if(arbiter == null || arbiter == ""){
        arbiter = account;
    };
    var includeTax = document.getElementById('escrowSellIncludeTax').checked;
    if (pricePerPound < 0 || pricePerPound == null || pricePerPound == "") {
        alert("Price must be greater than 0");
    } else if (pounds < 0 || pounds == null || pounds == "") {
        alert("Amount must be greater than 0");
    } else if (upFrontPercent > 100 || upFrontPercent < 0 ) {
        alert("Up front percent must be between 0 and 100");
    } else {
        App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                                 if(parseInt(pounds) > parseInt(balance)){
                                                 alert("Your balance is: " + balance);
                                                 return;
                                                 } else
                                                 if(tester){
                                                 web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                              var data = App.contracts.Fishare.createEscrow.getData(account, buyerAddress, arbiter, cost, pounds, upFrontPercent, includeTax);
                                                                              var tx = new ethereumjs.Tx({
                                                                                                         nonce: nonce,
                                                                                                         gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                         gasLimit: 250000,
                                                                                                         from: account,
                                                                                                         to: contractAddress,
                                                                                                         value: 0,
                                                                                                         data: data,
                                                                                                         });
                                                                              tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                              var raw = '0x' + tx.serialize().toString('hex');
                                                                              web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                          if(err){ alert(err)} else{
                                                                                                          App.pendingAndConfirmationModals(txnHash);}
                                                                                                          });
                                                                              });
                                                 } else {
                                                 App.contracts.Fishare.createEscrow(account, buyerAddress, arbiter, cost, pounds, upFrontPercent, includeTax, {from: account, gas: 250000}, (err, txnHash) => {
                                                                                    App.pendingAndConfirmationModals(txnHash);
                                                                                    });
                                                 };
                                                 });
    };
    
},
getEscrowOrders: function(event, accounts){
    var sellers;
    var buyers;
    var arbiters;
    var settlementDates;
    var prices;
    var amounts;
    var percentsUpFront;
    var taxIncluded;
    
    var sellersArray;
    var buyersArray;
    var arbitersArray;
    var settlementDatesArray;
    var pricesArray;
    var amountsArray;
    var percentsUpFrontArray;
    var taxIncludedArray;
    
    blankAddress = "0X0000000000000000000000000000000000000000";
    
    var table = document.getElementById("escrowSignedOrderTable");
    var escrowOrderTableCounter = 0;
    //set market price for selling if there are posted limit buy orders
    App.contracts.Fishare.getEscrows({from: account},(err, Orders) => {
                                     var chartOrders = [];
                                     var chartOrderLabels = [];
                                     sellers = Orders[0].toString();
                                     sellersArray = sellers.split(',');
                                     buyers = Orders[1].toString();
                                     buyersArray = buyers.split(',');
                                     arbiters = Orders[2].toString();
                                     arbitersArray = arbiters.split(',');
                                     prices = Orders[3].toString();
                                     pricesArray = prices.split(',');
                                     amounts = Orders[4].toString();
                                     amountsArray = amounts.split(',');
                                     percentsUpFront = Orders[5].toString();
                                     percentsUpFrontArray = percentsUpFront.split(',');
                                     taxIncluded = Orders[6].toString();
                                     taxIncludedArray = taxIncluded.split(',');
                                     App.contracts.Fishare.getSellerEscrowSignatures({from: account},(err, OrderSellerSigs) => {
                                                                                     var sellerSigned = OrderSellerSigs[0];
                                                                                     var sellerUnSigned = OrderSellerSigs[1];
                                                                                     var  sellerReleased = OrderSellerSigs[2];
                                                                                     var sellerDisputed = OrderSellerSigs[3];
                                                                                     App.contracts.Fishare.getBuyerEscrowSignatures({from: account},(err, OrderBuyerSigs) => {
                                                                                                                                    
                                                                                                                                    var buyerSigned = OrderBuyerSigs[0];
                                                                                                                                    var buyerUnSigned = OrderBuyerSigs[1];
                                                                                                                                    var  buyerReleased = OrderBuyerSigs[2];
                                                                                                                                    var buyerDisputed = OrderBuyerSigs[3];
                                                                                                                                    for (var i = 0; i < amountsArray.length ; i++) {
                                                                                                                                    if(sellersArray[i].toUpperCase() == String(account).toUpperCase() || buyersArray[i].toUpperCase() == String(account).toUpperCase()){
                                                                                                                                    totalEscrowBuyOrders = totalEscrowBuyOrders + parseInt(amountsArray[i]);
                                                                                                                                    if (escrowOrderTableCounter < escrowOrderLength){
                                                                                                                                    var row = document.getElementById('EscrowRow' + i);
                                                                                                                                    row.childNodes[0].innerHTML = i;
                                                                                                                                    if(sellersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != buyersArray[i].toUpperCase() && sellersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    row.childNodes[1].innerHTML = "Sell";
                                                                                                                                    } else if(buyersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != sellersArray[i].toUpperCase() && buyersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    row.childNodes[1].innerHTML = "Buy";
                                                                                                                                    }
                                                                                                                                    row.childNodes[2].innerHTML = amountsArray[i];
                                                                                                                                    row.childNodes[3].innerHTML = pricesArray[i];
                                                                                                                                    row.childNodes[4].innerHTML = percentsUpFrontArray[i];
                                                                                                                                    } else {
                                                                                                                                    var row = table.insertRow(-1);
                                                                                                                                    row.id = 'EscrowRow' + i;
                                                                                                                                    var cell1 = row.insertCell(0);
                                                                                                                                    var cell2 = row.insertCell(1);
                                                                                                                                    var cell3 = row.insertCell(2);
                                                                                                                                    var cell4 = row.insertCell(3);
                                                                                                                                    var cell5 = row.insertCell(4);
                                                                                                                                    var cell6 = row.insertCell(5);
                                                                                                                                    
                                                                                                                                    cell1.innerHTML = i;
                                                                                                                                    cell1.style.textAlign = "center";
                                                                                                                                    if(sellersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != buyersArray[i].toUpperCase() && sellersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    cell2.innerHTML = "Sell";
                                                                                                                                    } else if(buyersArray[i].toUpperCase() == String(account).toUpperCase() || (String(account).toUpperCase() != sellersArray[i].toUpperCase() && buyersArray[i].toUpperCase() == blankAddress)){
                                                                                                                                    cell2.innerHTML = "Buy";
                                                                                                                                    };
                                                                                                                                    cell2.style.textAlign = "center";
                                                                                                                                    cell3.innerHTML = amountsArray[i];
                                                                                                                                    cell3.style.textAlign = "center";
                                                                                                                                    cell4.innerHTML = pricesArray[i];
                                                                                                                                    cell4.style.textAlign = "center";
                                                                                                                                    cell5.innerHTML = percentsUpFrontArray[i];
                                                                                                                                    cell5.style.textAlign = "center";
                                                                                                                                    var btn = document.createElement('input');
                                                                                                                                    btn.type = "button";
                                                                                                                                    btn.className = "tableBtn";
                                                                                                                                    btn.value = "Actions";
                                                                                                                                    btn.onclick = showEscrowActions(i, sellersArray[i], buyersArray[i], arbitersArray[i], pricesArray[i], amountsArray[i], percentsUpFrontArray[i], taxIncludedArray[i], sellerSigned[i], buyerSigned[i], sellerUnSigned[i], buyerUnSigned[i], sellerReleased[i], buyerReleased[i], buyerDisputed[i], sellerDisputed[i]);
                                                                                                                                    cell6.appendChild(btn);
                                                                                                                                    cell6.style.textAlign = "center";
                                                                                                                                    escrowOrderLength++;
                                                                                                                                    };
                                                                                                                                    escrowOrderTableCounter++;
                                                                                                                                    };
                                                                                                                                    
                                                                                                                                    };
                                                                                                                                    if(escrowOrderTableCounter == 0){
                                                                                                                                    document.getElementById("yourEscrowOrders").style.display = 'none';
                                                                                                                                    } else {
                                                                                                                                    document.getElementById("yourEscrowOrders").style.display = 'block';
                                                                                                                                    document.getElementById("noSignedEscrowOrders").value = "Your Orders";
                                                                                                                                    };
                                                                                                                                    });
                                                                                     });
                                     
                                     
                                     
                                     });
    
},
popUpEscrowActions: function(id, seller, buyer, arbiter, price, amount, percentsUpFront, taxIncluded, sellerSigned, buyerSigned, sellerUnSigned, buyerUnSigned, sellerReleased, buyerReleased, buyerDisputed, sellerDisputed){
    // Get the modal
    var modal = document.getElementById('myModal');
    
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    var isSeller = false;
    var isBuyer = false;
    var isArbiter = false;
    if(account.toUpperCase() == seller.toUpperCase() || (account.toUpperCase() !=  buyer.toUpperCase() && seller.toUpperCase() == "0X0000000000000000000000000000000000000000")){
        isSeller = true;
    }
    if(account.toUpperCase() == buyer.toUpperCase() || (account != seller.toUpperCase() && buyer.toString().toUpperCase() == "0X0000000000000000000000000000000000000000")){
        isBuyer = true;
    }
    if(account.toUpperCase() == arbiter.toUpperCase() && arbiter.toString().toUpperCase() != "0X0000000000000000000000000000000000000000"){
        isArbiter = true;
    }
    
    document.getElementById("modalHeader").value = "Escrow Contract ID : " + id;
    if (seller.toUpperCase() == "0X0000000000000000000000000000000000000000"){
        document.getElementById("modalseller").value = "seller : _blank_";
    } else {
        document.getElementById("modalseller").value = "seller : " + seller;
    };
    if (buyer.toString().toUpperCase() == "0X0000000000000000000000000000000000000000"){
        document.getElementById("modalBuyer").value = "buyer : _blank_";
    } else {
        document.getElementById("modalBuyer").value = "buyer : " + buyer;
    };
    document.getElementById("modalArbiter").value = "arbiter : " + arbiter;
    document.getElementById("modalPrice").value = "price : " + price;
    document.getElementById("modalAmount").value = "amount : " + amount;
    document.getElementById("modalPercent").value = "percent up front : " + percentsUpFront;
    document.getElementById("modalTaxIncluded").value = "Tax Included : " + taxIncluded;
    document.getElementById("modalSellerSigned").value = "Signed : " + sellerSigned;
    document.getElementById("modalSellerUnSigned").value = "UnSigned : " + sellerUnSigned;
    document.getElementById("modalSellerDisputed").value = "Disputed : " + sellerDisputed;
    document.getElementById("modalSellerReleased").value = "Finalized : " + sellerReleased;
    document.getElementById("modalBuyerSigned").value = "Signed : " + buyerSigned;
    document.getElementById("modalBuyerUnSigned").value = "UnSigned : " + buyerUnSigned;
    document.getElementById("modalBuyerDisputed").value = "Disputed : " + buyerDisputed;
    document.getElementById("modalBuyerReleased").value = "Finalized : " + buyerReleased;
    
    document.getElementById("arbitrateFields").style.display = 'none';
    
    var table = document.getElementById("escrowOrderActionTable");
    
    var row = table.rows[0];
    row.id = 'EscrowActionRow';
    
    var cell1 = row.cells[0];
    var cell2 = row.cells[1];
    var cell3 = row.cells[2];
    var cell4 = row.cells[3];
    var cell5 = row.cells[4];
    var cell6 = row.cells[5];
    var cell7 = row.cells[6];
    
    var btn0 = document.getElementById('button1');
    btn0.type = "button";
    btn0.className = "btnEscrowModal";
    btn0.value = "sign";
    var btn = document.getElementById('button2');
    btn.type = "button";
    btn.className = "btnEscrowModal";
    btn.value = "unSign";
    var btn2 = document.getElementById('button3');
    btn2.type = "button";
    btn2.className = "btnEscrowModal";
    btn2.value = "dispute";
    var btn3 = document.getElementById('button4');
    btn3.type = "button";
    btn3.className = "btnEscrowModal";
    btn3.value = "unDispute";
    var btn4 = document.getElementById('button5');
    btn4.type = "button";
    btn4.className = "btnEscrowModal";
    btn4.value = "finalize";
    var btn5 = document.getElementById('button6');
    btn5.type = "button";
    btn5.className = "btnEscrowModal";
    btn5.value = "unFinalize";
    var btn6 = document.getElementById('button7');
    btn6.type = "button";
    btn6.className = "btnEscrowModal";
    btn6.value = "arbitrate";
    
    if(isSeller == true){
        if(sellerSigned == false && seller.toUpperCase() == "0X0000000000000000000000000000000000000000"){
            btn0.style.background='#00fef7';
            btn0.onclick = signEscrow(id, 0, "sell", amount);
        } else {
            btn0.style.background='#ffffff';
            btn0.onclick = alertText("You have already signed this escrow contract.");
        }
        if(sellerUnSigned == false && account.toUpperCase() == seller.toUpperCase()){
            btn.style.background='#00fef7';
            btn.onclick = unsignEscrow(id);
        } else {
            btn.style.background='#ffffff';
            btn.onclick = alertText("You have already unSigned this escrow contract.");
        }
        if(sellerDisputed == false && account.toUpperCase() == seller.toUpperCase()){
            btn2.style.background='#00fef7';
            btn2.onclick = disputeEscrow(id);
            btn3.style.background='#ffffff';
            btn3.onclick = alertText("You have not disputed this contract.");
        } else if(sellerDisputed == false && seller.toUpperCase() == "0X0000000000000000000000000000000000000000"){
            btn2.style.background='#ffffff';
            btn2.onclick = alertText("You have not signed this contract.");
            btn3.style.background='#ffffff';
            btn3.onclick = alertText("You have not signed this contract.");
        } else {
            btn2.style.background='#ffffff';
            btn2.onclick = alertText("You have already disputed this escrow contract.");
            btn3.style.background='#00fef7';
            btn3.onclick = unDisputeEscrow(id);
        }
        
        
        if(sellerReleased == false && account.toUpperCase() == seller.toUpperCase()){
            btn4.style.background='#00fef7';
            btn4.onclick = releaseEscrow(id);
            btn5.style.background='#ffffff';
            btn5.onclick = alertText("You have not finalized this contract.");
        } else if(sellerReleased == false && seller.toUpperCase() == "0X0000000000000000000000000000000000000000"){
            btn4.style.background='#ffffff';
            btn4.onclick = alertText("You have not signed this contract.");
            btn5.style.background='#ffffff';
            btn5.onclick = alertText("You have not signed this contract.");
        } else {
            btn4.style.background='#ffffff';
            btn4.onclick = alertText("You have already released this escrow contract.");
            btn5.style.background='#00fef7';
            btn5.onclick = unreleaseEscrow(id);
        }
    } else if (isBuyer == true){
        if(buyerSigned == false && buyer.toUpperCase() == "0X0000000000000000000000000000000000000000"){
            App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                             btn0.style.background='#00fef7';
                                             if(taxIncluded.toUpperCase() == "TRUE"){
                                             btn0.onclick = signEscrow(id, Math.floor((100+parseInt(taxRate))*price/100), "buy", amount);
                                             } else {
                                             btn0.onclick = signEscrow(id, price, "buy", amount);
                                             };
                                             });
            
        } else {
            btn0.style.background='#ffffff';
            btn0.onclick = alertText("You have already signed this escrow contract.");
        }
        if(buyerUnSigned == false && account.toUpperCase() == buyer.toUpperCase()){
            btn.style.background='#00fef7';
            btn.onclick = unsignEscrow(id);
        } else {
            btn.style.background='#ffffff';
            btn.onclick = alertText("You have already unSigned this escrow contract.");
        }
        if(buyerDisputed == false && account.toUpperCase() == buyer.toUpperCase()){
            btn2.style.background='#00fef7';
            btn2.onclick = disputeEscrow(id);
            btn3.style.background='#ffffff';
            btn3.onclick = alertText("You have not disputed this contract.");
        } else if(buyerDisputed == false && buyer.toUpperCase() == "0X0000000000000000000000000000000000000000"){
            btn2.style.background='#ffffff';
            btn2.onclick = alertText("You have not signed this contract.");
            btn3.style.background='#ffffff';
            btn3.onclick = alertText("You have not signed this contract.");
        } else {
            btn2.style.background='#ffffff';
            btn2.onclick = alertText("You have already disputed this escrow contract.");
            btn3.style.background='#00fef7';
            btn3.onclick = unDisputeEscrow(id);
        }
        
        if(buyerReleased == false && account.toUpperCase() == buyer.toUpperCase()){
            btn4.style.background='#00fef7';
            btn4.onclick = releaseEscrow(id);
            btn5.style.background='#ffffff';
            btn5.onclick = alertText("You have not finalized this contract.");
        } else if(buyerReleased == false && buyer.toUpperCase() == "0X0000000000000000000000000000000000000000"){
            btn4.style.background='#ffffff';
            btn4.onclick = alertText("You have not signed this contract.");
            btn5.style.background='#ffffff';
            btn5.onclick = alertText("You have not signed this contract.");
        } else {
            btn4.style.background='#ffffff';
            btn4.onclick = alertText("You have already released this escrow contract.");
            btn5.style.background='#00fef7';
            btn5.onclick = unreleaseEscrow(id);
        }
    };
    if(isArbiter == true){
        if(buyerDisputed == true || sellerDisputed == true){
            if(buyerSigned == true && sellerSigned == true){
                btn6.style.background='#00fef7';
                btn6.onclick = arbitrateEscrow(id);
            } else {
                btn6.style.background='#ffffff';
                btn6.onclick = alertText("Both buyer and seller have not signed.");
            }
        } else {
            btn6.style.background='#ffffff';
            btn6.onclick = alertText("Neither buyer nor seller has disputed.");
        }
    } else {
        btn6.style.background='#ffffff';
        btn6.onclick = alertText("You are not the arbiter for this contract.");
    };
    
    cell1.appendChild(btn0);
    cell1.style.textAlign = "right";
    cell2.appendChild(btn);
    cell2.style.textAlign = "left";
    cell3.appendChild(btn2);
    cell3.style.textAlign = "right";
    cell4.appendChild(btn3);
    cell4.style.textAlign = "left";
    cell5.appendChild(btn4);
    cell5.style.textAlign = "right";
    cell6.appendChild(btn5);
    cell6.style.textAlign = "left";
    cell7.appendChild(btn6);
    cell7.style.textAlign = "center";
    
},
signEscrow: function(arg, payment, type, amount){
    document.getElementById("arbitrateFields").style.display = 'none';
    if(type == "sell"){
        App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                                 if(balance < amount){
                                                 alert("Insufficient fish balance.  You own " + balance + " fish.");
                                                 } else {
                                                 if(tester){
                                                 web3.eth.getTransactionCount(account, function (err, nonce) {
                                                                              var data = App.contracts.Fishare.signEscrow.getData(arg);
                                                                              var tx = new ethereumjs.Tx({
                                                                                                         nonce: nonce,
                                                                                                         gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                                         gasLimit: 1000000,
                                                                                                         from: account,
                                                                                                         to: contractAddress,
                                                                                                         value: payment,
                                                                                                         data: data,
                                                                                                         });
                                                                              tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                                              var raw = '0x' + tx.serialize().toString('hex');
                                                                              web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                                          if(err){ alert(err)} else{
                                                                                                          App.pendingAndConfirmationModals(txnHash);}
                                                                                                          });
                                                                              });
                                                 } else {
                                                 App.contracts.Fishare.signEscrow(arg, {from: account, gas: 1000000, value: payment}, (err, txnHash) => {
                                                                                  App.pendingAndConfirmationModals(txnHash);
                                                                                  });
                                                 };
                                                 };
                                                 });
    } else {
        web3.eth.getBalance(account, function (error, balance) {
                            if (error) {
                            alert(error);
                            } else {
                            if(parseInt(balance) < parseInt(payment)){
                            alert("insufficient funds");
                            } else {
                            if(tester){
                            web3.eth.getTransactionCount(account, function (err, nonce) {
                                                         var data = App.contracts.Fishare.signEscrow.getData(arg);
                                                         var tx = new ethereumjs.Tx({
                                                                                    nonce: nonce,
                                                                                    gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                                    gasLimit: 1000000,
                                                                                    from: account,
                                                                                    to: contractAddress,
                                                                                    value: payment,
                                                                                    data: data,
                                                                                    });
                                                         tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                                         var raw = '0x' + tx.serialize().toString('hex');
                                                         alert(raw);
                                                         web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                                     if(err){ alert(err)} else{
                                                                                     App.pendingAndConfirmationModals(txnHash);}
                                                                                     });
                                                         });
                            } else {
                            App.contracts.Fishare.signEscrow(arg, {from: account, gas: 1000000, value: payment}, (err, txnHash) => {
                                                             App.pendingAndConfirmationModals(txnHash);
                                                             });
                            };
                            };
                            };
                            });
    };
},
UnsignEscrow: function(arg){
    document.getElementById("arbitrateFields").style.display = 'none';
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.unSignEscrow.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 1000000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.unSignEscrow(arg, {from: account, gas: 1000000}, (err, txnHash) => {
                                           App.pendingAndConfirmationModals(txnHash);
                                           });
    };
},
DisputeEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.disputeEscrow.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 1000000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.disputeEscrow(arg, {from: account, gas: 1000000}, (err, txnHash) => {
                                            App.pendingAndConfirmationModals(txnHash);
                                            });
    };
},
unDisputeEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.unDisputeEscrow.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 1000000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.unDisputeEscrow(arg, {from: account, gas: 1000000}, (err, txnHash) => {
                                              App.pendingAndConfirmationModals(txnHash);
                                              });
    };
},
releaseEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.releaseEscrow.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 1000000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.releaseEscrow(arg, {from: account, gas: 1000000}, (err, txnHash) => {
                                            App.pendingAndConfirmationModals(txnHash);
                                            });
    };
},
unreleaseEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.unReleaseEscrow.getData(arg);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 1000000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.unReleaseEscrow(arg, {from: account, gas: 1000000}, (err, txnHash) => {
                                              App.pendingAndConfirmationModals(txnHash);
                                              });
    };
},
arbitrateEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'block';
    var table = document.getElementById("escrowArbitrateFields");
    var row = table.insertRow(-1);
    row.id = 'arbitrateExecuteRow';
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btnEscrowModal";
    btn.value = "Complete";
    
    
    btn.onclick = submitArbitration(arg);
    
    cell2.appendChild(btn);
    cell2.style.textAlign = "center";
    
},
submitArbitration: function(id){
    if(tester){
        web3.eth.getTransactionCount(account, function (err, nonce) {
                                     var data = App.contracts.Fishare.arbitrateEscrow.getData(id, document.getElementById("arbitrateFishSeller").value, document.getElementById("arbitrateFishBuyer").value, document.getElementById("arbitratePaymentSeller").value, document.getElementById("arbitratePaymentBuyer").value);
                                     var tx = new ethereumjs.Tx({
                                                                nonce: nonce,
                                                                gasPrice: web3.toHex(web3.toWei('5', 'gwei')),
                                                                gasLimit: 100000000,
                                                                from: account,
                                                                to: contractAddress,
                                                                value: 0,
                                                                data: data,
                                                                });
                                     tx.sign(ethereumjs.Buffer.Buffer.from(testKey, 'hex'));
                                     var raw = '0x' + tx.serialize().toString('hex');
                                     web3.eth.sendRawTransaction(raw, function (err, txnHash) {
                                                                 if(err){ alert(err)} else{
                                                                 App.pendingAndConfirmationModals(txnHash);}
                                                                 });
                                     });
    } else {
        App.contracts.Fishare.arbitrateEscrow(id, document.getElementById("arbitrateFishSeller").value, document.getElementById("arbitrateFishBuyer").value, document.getElementById("arbitratePaymentSeller").value, document.getElementById("arbitratePaymentBuyer").value, {from: account, gas: 100000000}, (err, txnHash) => {
                                              App.pendingAndConfirmationModals(txnHash);
                                              });
    };
},
alertText: function(arg){
    alert(arg);
},
makeTableScroll: function() {
    setTimeout( function() {
               // Constant retrieved from server-side via JSP
               var maxRows = 20;
               
               var table = document.getElementById("transactionTable");
               var wrapper = table.parentNode;
               var rowsInTable = table.rows.length;
               try {
               var border = getComputedStyle(table.rows[0].cells[0], '').getPropertyValue('border-top-width');
               border = border.replace('px', '') * 1;
               } catch (e) {
               var border = table.rows[0].cells[0].currentStyle.borderWidth;
               border = (border.replace('px', '') * 1) / 2;
               };
               var height = 0;
               if (rowsInTable > maxRows) {
               for (var i = 0; i < maxRows; i++) {
               height += table.rows[i].clientHeight + border;
               }
               wrapper.style.height = height + "px";
               };
               }, 5000);
    
},
fishTransactions: function(){
    App.contracts.Fishare.escrowFinalized({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
                                                                                       if (error)
                                                                                       alert('Error in myEvent event handler: ' + error);
                                                                                       else
                                                                                       //var jsonObj = $.parseJSON(JSON.stringify(eventResult));
                                                                                       //var test = JSON.stringify(eventResult).split(',');
                                                                                       document.getElementById("transactions").style.display = "block";
                                                                                       for(var i = 0; i<eventResult.length; i++){
                                                                                       if((eventResult[i].args._seller).toString() == account || (eventResult[i].args._buyer).toString() == account){
                                                                                       App.getFishTrans(i, eventResult[i]);
                                                                                       };
                                                                                       };
                                                                                       });
},
shareTransactions: function(){
    App.contracts.Fishare.boughtShares({}, { fromBlock: 0, toBlock: 'latest' }).get((error, eventResult) => {
                                                                                    if (error)
                                                                                    alert('Error in myEvent event handler: ' + error);
                                                                                    else
                                                                                    for(var i = 0; i<eventResult.length; i++){
                                                                                    if(eventResult[i].args._buyer.toString() == account){
                                                                                    App.getShareTrans(i, eventResult[i]);
                                                                                    };
                                                                                    };
                                                                                    });
},
showTransactionHistory: function(){
    if(tester){
        alert("Transaction History currently only works with your own account.  You can view your history in raw form way by clicking View on Etherscan.");
    } else
        var homeScreen = document.getElementById("homeScreen");
    homeScreen.style.display = "none";
    var homeScreen = document.getElementById("transactionScreen");
    homeScreen.style.display = "block";
},
showHomeScreen: function(){
    var homeScreen = document.getElementById("homeScreen");
    homeScreen.style.display = "block";
    var homeScreen = document.getElementById("transactionScreen");
    homeScreen.style.display = "none";
},
showTransModal: function(date, transHash, event, args){
    var modal = document.getElementById('transModal');
    modal.style.display = "block";
    var transTitle;
    var counterParty;
    if(event=="escrowFinalized"){
        if(account == args._buyer.toString()){
            transTitle = ("<u>Bought Fish</U>").bold();
            counterParty = "Seller: " + args._seller.toString();
        } else if(account == args._seller.toString()) {
            transTitle = ("<u>Sold Fish<u/>").bold();
            counterParty = "Buyer: " + args._buyer.toString();
        }
        var table = document.getElementById("transModalDetails");
        var rowData = [transTitle, "Date: " + date.toString(), "Amount (lbs): " + args._amount.toString(), "Price (wei): " + args._price.toString(), "Percent paid up front: " + args._percentUpFront.toString(), "Tax Included: " + args._taxIncluded.toString(), counterParty, "Arbiter: " + args._arbiter.toString()];
        var btn = document.getElementById("btnViewEtherscan");
        btn.onclick = openTransinEtherscan(transHash);
        var rowCount = $('#transModalDetails tr').length;
        for(var i=0; i < rowData.length; i++){
            if (i < rowCount){
                var row = document.getElementById('transModalDetails' + i);
                row.childNodes[0].innerHTML = rowData[i];
            } else {
                var row = table.insertRow(-1);
                row.id = 'transModalDetails' + i;
                var cell1 = row.insertCell(0);
                cell1.innerHTML = rowData[i];
                cell1.style.textAlign = "left";
            };
        };
    } else if (event=="boughtShares"){
        var table = document.getElementById("transModalDetails");
        var rowData = [("<u>Bought Shares</u>").bold(), "Date: " + date.toString(), "Amount: " + args._amount.toString(), "Payment (wei): " + args._value.toString()];
        var btn = document.getElementById("btnViewEtherscan");
        btn.onclick = openTransinEtherscan(transHash);
        var rowCount = $('#transModalDetails tr').length;
        for(var i=0; i < rowData.length; i++){
            if (i < rowCount){
                var row = document.getElementById('transModalDetails' + i);
                row.childNodes[0].innerHTML = rowData[i];
            } else {
                var row = table.insertRow(-1);
                row.id = 'transModalDetails' + i;
                var cell1 = row.insertCell(0);
                cell1.innerHTML = rowData[i];
                cell1.style.textAlign = "left";
            };
        };
    } else if (event=="soldShares"){
        var table = document.getElementById("transModalDetails");
        var rowData = [("<u>Sold Shares</u>").bold(), "Date: " + date.toString(), "Amount: " + args._amount.toString(), "Payment (wei): " + args._value.toString()];
        var btn = document.getElementById("btnViewEtherscan");
        btn.onclick = openTransinEtherscan(transHash);
        var rowCount = $('#transModalDetails tr').length;
        for(var i=0; i < rowData.length; i++){
            if (i < rowCount){
                var row = document.getElementById('transModalDetails' + i);
                row.childNodes[0].innerHTML = rowData[i];
            } else {
                var row = table.insertRow(-1);
                row.id = 'transModalDetails' + i;
                var cell1 = row.insertCell(0);
                cell1.innerHTML = rowData[i];
                cell1.style.textAlign = "left";
            };
        };
    }
    
    
},
openTransinEtherscan: function(transHash){
    var url = "https://ropsten.etherscan.io/tx/" + transHash;
    window.open(url, "_blank");
},
showAccountOnEtherescan: function(){
    var url = "https://ropsten.etherscan.io/address/" + account;
    window.open(url, "_blank");
},
awaitBlockConsensus: function(txhash, blockCount, timeout, callback) {
    var startBlock = Number.MAX_SAFE_INTEGER;
    var interval;
    var stateEnum = { start: 1, mined: 2, awaited: 3, confirmed: 4, unconfirmed: 5 };
    var savedTxInfo;
    var attempts = 0;
    
    var pollState = stateEnum.start;
    
    var poll = function() {
        if (pollState === stateEnum.start) {
            web3.eth.getTransaction(txhash, function(e, txInfo) {
                                    if (e || txInfo == null) {
                                    return; // XXX silently drop errors
                                    }
                                    if (txInfo.blockHash != null) {
                                    startBlock = txInfo.blockNumber;
                                    savedTxInfo = txInfo;
                                    console.log("mined");
                                    pollState = stateEnum.mined;
                                    }
                                    });
        }
        else if (pollState == stateEnum.mined) {
            web3.eth.getBlockNumber(function (e, blockNum) {
                                    if (e) {
                                    return; // XXX silently drop errors
                                    }
                                    console.log("blockNum: ", blockNum);
                                    if (blockNum >= (blockCount + startBlock)) {
                                    pollState = stateEnum.awaited;
                                    }
                                    });
        }
        else if (pollState == stateEnum.awaited) {
            web3.eth.getTransactionReceipt(txhash, function(e, receipt) {
                                           if (e || receipt == null) {
                                           return; // XXX silently drop errors.  TBD callback error?
                                           }
                                           // confirm we didn't run out of gas
                                           // XXX this is where we should be checking a plurality of nodes.  TBD
                                           clearInterval(interval);
                                           if (receipt.gasUsed >= savedTxInfo.gas) {
                                           pollState = stateEnum.unconfirmed;
                                           callback(new Error("we ran out of gas, not confirmed!"), null);
                                           } else {
                                           pollState = stateEnum.confirmed;
                                           callback(null, receipt);
                                           }
                                           });
        } else {
            throw(new Error("We should never get here, illegal state: " + pollState));
        }
        
        // note assuming poll interval is 1 second
        attempts++;
        if (attempts > timeout) {
            clearInterval(interval);
            pollState = stateEnum.unconfirmed;
            callback(new Error("Timed out, not confirmed"), null);
        }
    };
    
    interval = setInterval(poll, 1000);
    poll();
},
pendingAndConfirmationModals: function (txnHash){
    document.getElementById("showPending").style.display = "block";
    document.getElementById("pendingModal").style.display = "block";
    document.getElementById("pendingText").style.display = "block";
    document.getElementById("confirmedText").style.display = "none";
    setTimeout( function() {
               document.getElementById("pendingModal").style.display = "none";
               }, 2000);
    App.awaitBlockConsensus(txnHash, 1, 300, function(error, transaction_receipt){
                            if(error == null){
                            document.getElementById("showPending").style.display = "none";
                            document.getElementById("pendingModal").style.display = "block";
                            document.getElementById("pendingText").style.display = "none";
                            document.getElementById("confirmedText").style.display = "block";
                            setTimeout( function() {
                                       document.getElementById("pendingModal").style.display = "none";
                                       }, 2000);
                            App.refresh();
                            }
                            });
},
getTaxAddress: function() {
    App.contracts.Fishare.getTaxAddress((err, taxAddress) => {
                                        if(err == null){
                                        document.getElementById("taxAddress").innerHTML = taxAddress
                                        }
                                        });
}
};

$(function() {
  $(window).load(function() {
                 
                 App.init();
                 });
  });

// close the modal window used for escrow actions
window.onclick = function(event) {
    var span = document.getElementsByClassName("close");
    if(event.target == document.getElementsByClassName('close')[0] || event.target == document.getElementsByClassName('close')[1] || event.target == document.getElementsByClassName('close')[2]) {
        document.getElementById('myModal').style.display = "none";
        document.getElementById('transModal').style.display = "none";
        document.getElementById('pendingModal').style.display = "none";
    };
    if (event.target == document.getElementById('myModal') || event.target == document.getElementById('transModal') || event.target == document.getElementById('pendingModal')) {
        document.getElementById('myModal').style.display = "none";
        document.getElementById('transModal').style.display = "none";
        document.getElementById('pendingModal').style.display = "none";
    };
};

