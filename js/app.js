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
var escrowOrderActionsLength = 0;
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
var signEscrow = function(arg, payment) {
    return function() { App.signEscrow(arg, payment); };
};
var arbitrateEscrow = function(arg) {
    return function() { App.arbitrateEscrow(arg); };
};
var alertText = function(arg) {
    return function() { App.alertText(arg); };
};
var submitArbitration = function(id){
    return function() {App.submitArbitration(id); };
},
App = {
  web3Provider: null,
  contracts: {},
  init:
    function() {
      return App.initWeb3();
      
  },

  initWeb3: function() {
      // Is there an injected web3 instance?
      if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
      } else {
          // If no injected web3 instance is detected, user Infura
          App.web3Provider = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/4b559a9b6ed64477a68c49e426efebeb"));
      }
      web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
                var ContractInstance;
                const MyContract = web3.eth.contract([
                                                       {
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
                                                                  "indexed": true,
                                                                  "name": "_poster",
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
                                                       "name": "PostBuyOrder",
                                                       "type": "event"
                                                       },
                                                       {
                                                       "anonymous": false,
                                                       "inputs": [
                                                                  {
                                                                  "indexed": true,
                                                                  "name": "_poster",
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
                                                       "name": "PostSellOrder",
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
      
      App.contracts.Fishare = MyContract.at("0x8af527e0b1c25777300a017f14dff3eb21a31789");
      var FishareInstance;
      web3.eth.getAccounts(function(error, accounts) {
                                     if (error) {
                                     alert(error);
                                     }
                                     
                                     var account = accounts[0];
                                     App.contracts.Fishare.balanceOf(account, (err, result) => {
                                                      document.getElementById("balance").innerHTML = result;
                                                                     document.getElementById("shareBalance").innerHTML = result;
                                                                });
                App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                                                   if(result == true){
                                                                                   document.getElementById("registrationstatus").innerHTML = "registered";
                                                                                   } else document.getElementById("registrationstatus").innerHTML = "unregistered";
                                                                                   });
                App.contracts.Fishare.getSharesClaimed((err, ClaimedShares) => {
                                                                                   document.getElementById("outstanding").innerHTML = ClaimedShares;
                                                                                   });
                App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                                                                   document.getElementById("numFishOwn").innerHTML = balance;
                                                                                   });
                
        });
        App.getOrders();
        App.getEscrowOrders();
        App.getTaxRate();
        return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.buy', App.Buy);
    $(document).on('click', '.refresh', App.Refresh);
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
  },

  getBalance: function(account) {
      var FishareInstance;
      web3.eth.getAccounts(function(error, accounts) {
                           if (error) {
                           alert(error);
                            }
                           var account = accounts[0];
                           App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                                         if(result == true){
                                                                         document.getElementById("registrationstatus").innerHTML = "registered";
                                                                         } else document.getElementById("registrationstatus").innerHTML = "unregistered";
                                                                         });
                           });
  },
Register: function(event, ContractInstance) {
    event.preventDefault();
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.register((err, result) => {
                                                                       App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                                               if(result == true){
                                                                               document.getElementById("registrationstatus").innerHTML = "registered";
                                                                               } else document.getElementById("registrationstatus").innerHTML = "unregistered";
                                                                               });
                                                        });
                         });
},
Buy: function(event) {
    event.preventDefault();
    var shares = document.getElementById("shares").value;
    web3.eth.getAccounts(function(error, accounts) {
                           if (error) {
                           alert(error);
                           }
                           var account = accounts[0];
                         App.contracts.Fishare.limit((err, limit) => {
                           App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                                                           if(result == true){
                                                              App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                         if(parseInt(balance) + parseInt(shares)>limit){
                                                                           alert("You cannot exceed the limit of 1000 lbs");
                                                                           return;
                                                                          } else
                                                                    App.contracts.Fishare.claimTokens(shares, {from: account, gas: 800000}, (err, result) => {});
                                                              });
                                                            } else alert("You are not registered");
                           });
                                                     });
    });
    
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
     web3.eth.getAccounts(function(error, accounts) {
                          if (error) {
                          alert(error);
                          }
                          var account = accounts[0];
                          App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                        if(parseInt(balance) < parseInt(shares)){
                                                                            alert("You do not have enough shares to transfer");
                                                                            return;
                                                                        } else App.contracts.Fishare.isRegistered(addressTo, (err, result) => {
                                                                                if(result == false){
                                                                                    alert("Address to transfer shares to is not registered.");
                                                                                } else App.contracts.Fishare.transfer(addressTo, shares, {from: account, gas: 100000}, (err, result) => {});
                                                                                 });
                                                                        });
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
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                                                       if(parseInt(balance) < parseInt(numTransfer)){
                                                                       alert("You do not own enough fish to transfer");
                                                                       return;
                                                                       } else App.contracts.Fishare.transferOwnership(addressTo, numTransfer, {from: account, gas: 100000}, (err, result) => {});
                                                                  });
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
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
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
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
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
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                            if(result == true){
                                                            App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                                            if(parseInt(numShares) > parseInt(balance)){
                                                                                            alert("Your balance is: " + balance);
                                                                                            return;
                                                                                            } else
                                                                                            App.contracts.Fishare.PostLimitSell(numShares, sellPrice, {from: account, gas: 200000}, (err, result) => {});
                                                                                            });
                                                            } else alert("You are not registered");
                                                            });
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
    
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
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
    });
},
fillSellOrders: function(numOrdersToFill, change, payment){
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.fillSellOrders(numOrdersToFill, change, {from: account, gas: 700000, value: payment}, (err, result) => {});
                         });
},
marketSellExecute: function(event){
    var numShares = document.getElementById("marketSellShares").value;
    var sharesToFillRemaining = numShares;
    var numOrdersToFill = 0;
    var change = 0;
    var buyOrderAddresses;
    var buyOrderAmounts;
    var buyOrderPrices;
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
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
                         });
},
fillBuyOrders: function(numOrdersToFill, change){
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.fillBuyOrders(numOrdersToFill, change, {from: account, gas: 6654755}, (err, result) => {});
                         });
},
limitBuyExecute: function(event){
    var price = document.getElementById("limitBuyPrice");
    var shares = document.getElementById("limitBuyShares");
    var cost = shares.value*price.value/(1000000000000000000);
    if(price.value.length == 0){
        alert("Price is blank");
    } else if(shares.value.length == 0){
        alert("Number of shares to buy is blank");
    } else {
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.isRegistered(account, (err, result) => {
                                                            if(result == true){
                                                            App.contracts.Fishare.balanceOf(account, (err, balance) => {
                                                                                            if(parseInt(balance) + parseInt(shares.value)>1000){
                                                                                            alert("You cannot exceed the limit of 1000 lbs");
                                                                                            return;
                                                                                            } else
                                                                                            App.contracts.Fishare.PostLimitBuy(shares.value, price.value, {from: account, gas: 200000, value: web3.toWei(cost, 'ether')}, (err, result) => {});
                                                                                            });
                                                            } else alert("You are not registered");
                                                            });
                         
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
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
   
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
                                                                           if(addressesArray[i] == String(account)){
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
                                                                                                if(addressesArray[i] == String(account)){
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
                         
                         });
                   
},
removeBuyOrder: function(arg, accounts){
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.CancelLimitBuy(arg, {from: accounts[0], gas: 100000}, (err, result) => {});
                         });
},
removeSellOrder: function(arg, accounts){
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.CancelLimitSell(arg, {from: accounts[0], gas: 100000}, (err, result) => {});
                         });
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
    
    blankAddress = "0x0000000000000000000000000000000000000000";
    
    document.getElementById("escrowOpenSellOrderTableVis").style.display = 'none';
    document.getElementById("escrowOpenBuyOrderTableVis").style.display = 'block';
    var table = document.getElementById("escrowOpenBuyOrderTable");
    var escrowOpenOrderTableCounter = 0;
    
    //set market price for buying if there are posted limit sell orders
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         
                         //set market price for selling if there are posted limit buy orders
                         App.contracts.Fishare.getEscrows((err, Orders) => {
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
                                                                       App.contracts.Fishare.getSellerEscrowSignatures((err, OrderSellerSigs) => {
                                                                                                                     var sellerSigned = OrderSellerSigs[0];
                                                                                                                     var sellerUnSigned = OrderSellerSigs[1];
                                                                                                                     var  sellerReleased = OrderSellerSigs[2];
                                                                                                                     var sellerDisputed = OrderSellerSigs[3];
                                                                                                                     App.contracts.Fishare.getBuyerEscrowSignatures((err, OrderBuyerSigs) => {
                                                                                                                                                                   var buyerSigned = OrderBuyerSigs[0];
                                                                                                                                                                   var buyerUnSigned = OrderBuyerSigs[1];
                                                                                                                                                                   var  buyerReleased = OrderBuyerSigs[2];
                                                                                                                                                                   var buyerDisputed = OrderBuyerSigs[3];
                                                                                                                                                                   for (var i = 0; i < amountsArray.length ; i++) {
                                                                                                                                                                   if(sellersArray[i] != String(account) && buyersArray[i] != String(account) && buyersArray[i] == blankAddress){
                                                                                                                                                                   totalEscrowOpenSellOrders++;
                                                                                                                                                                   if (escrowOpenOrderTableCounter < escrowOpenOrderLength){
                                                                                                                                                                   var row = document.getElementById('EscrowOpenOrderRow' + i);
                                                                                                                                                                   row.childNodes[0].innerHTML = i;
                                                                                                                                                                   row.childNodes[1].innerHTML = amountsArray[i];
                                                                                                                                                                   row.childNodes[2].innerHTML = pricesArray[i];
                                                                                                                                                                   row.childNodes[3].innerHTML = percentsUpFrontArray[i];
                                                                                                                                                                   } else {
                                                                                                                                                                   var row = table.insertRow(-1);
                                                                                                                                                                   row.id = 'EscrowOpenOrderRow' + i;
                                                                                                                                                                   var cell1 = row.insertCell(0);
                                                                                                                                                                   var cell2 = row.insertCell(1);
                                                                                                                                                                   var cell3 = row.insertCell(2);
                                                                                                                                                                   var cell4 = row.insertCell(3);
                                                                                                                                                                   var cell5 = row.insertCell(4);
                                                                                                                                                                   
                                                                                                                                                                   cell1.innerHTML = i;
                                                                                                                                                                   cell1.style.textAlign = "center";
                                                                                                                                                                   cell2.innerHTML = amountsArray[i];
                                                                                                                                                                   cell2.style.textAlign = "center";
                                                                                                                                                                   cell3.innerHTML = pricesArray[i];
                                                                                                                                                                   cell3.style.textAlign = "center";
                                                                                                                                                                   cell4.innerHTML = percentsUpFrontArray[i];
                                                                                                                                                                   cell4.style.textAlign = "center";
                                                                                                                                                                   var btn = document.createElement('input');
                                                                                                                                                                   btn.type = "button";
                                                                                                                                                                   btn.className = "tableBtn";
                                                                                                                                                                   btn.value = "Actions";
                                                                                                                                                                   btn.onclick = showEscrowActions(i, sellersArray[i], buyersArray[i], arbitersArray[i], pricesArray[i], amountsArray[i], percentsUpFrontArray[i], taxIncludedArray[i], sellerSigned[i], buyerSigned[i], sellerUnSigned[i], buyerUnSigned[i], sellerReleased[i], buyerReleased[i], buyerDisputed[i], sellerDisputed[i]);
                                                                                                                                                                   cell5.appendChild(btn);
                                                                                                                                                                   cell5.style.textAlign = "center";
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
    
    blankAddress = "0x0000000000000000000000000000000000000000";
    
    document.getElementById("escrowOpenSellOrderTableVis").style.display = 'block';
    document.getElementById("escrowOpenBuyOrderTableVis").style.display = 'none';
    var table = document.getElementById("escrowOpenSellOrderTable");
    var escrowOpenOrderTableCounter = 0;
    
    //set market price for buying if there are posted limit sell orders
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         
                         //set market price for selling if there are posted limit buy orders
                         App.contracts.Fishare.getEscrows((err, Orders) => {
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
                                                                       App.contracts.Fishare.getSellerEscrowSignatures((err, OrderSellerSigs) => {
                                                                                                                     var sellerSigned = OrderSellerSigs[0];
                                                                                                                     var sellerUnSigned = OrderSellerSigs[1];
                                                                                                                     var  sellerReleased = OrderSellerSigs[2];
                                                                                                                     var sellerDisputed = OrderSellerSigs[3];
                                                                                                                     App.contracts.Fishare.getBuyerEscrowSignatures((err, OrderBuyerSigs) => {
                                                                                    
                                                                                                                                                                   var buyerSigned = OrderBuyerSigs[0];
                                                                                                                                                                   var buyerUnSigned = OrderBuyerSigs[1];
                                                                                                                                                                   var  buyerReleased = OrderBuyerSigs[2];
                                                                                                                                                                   var buyerDisputed = OrderBuyerSigs[3];
                                                                                                                                                                   for (var i = 0; i < amountsArray.length ; i++) {
                                                                                                                                                                   if(sellersArray[i] != String(account) && buyersArray[i] != String(account) && sellersArray[i] == blankAddress){
                                                                                                                                                                   
                                                                                                                                                                   if (escrowOpenOrderTableCounter < totalEscrowOpenBuyOrders){
                                                                                                                                                                   var row = document.getElementById('EscrowOpenOrderRow' + i);
                                                                                                                                                                   row.childNodes[0].innerHTML = i;
                                                                                                                                                                   row.childNodes[1].innerHTML = amountsArray[i];
                                                                                                                                                                   row.childNodes[2].innerHTML = pricesArray[i];
                                                                                                                                                                   row.childNodes[3].innerHTML = percentsUpFrontArray[i];
                                                                                                                                                                   } else {
                                                                                                                                                                   var row = table.insertRow(-1);
                                                                                                                                                                   row.id = 'EscrowOpenOrderRow' + i;
                                                                                                                                                                   var cell1 = row.insertCell(0);
                                                                                                                                                                   var cell2 = row.insertCell(1);
                                                                                                                                                                   var cell3 = row.insertCell(2);
                                                                                                                                                                   var cell4 = row.insertCell(3);
                                                                                                                                                                   var cell5 = row.insertCell(4);
                                                                                                                                                                   
                                                                                                                                                                   cell1.innerHTML = i;
                                                                                                                                                                   cell1.style.textAlign = "center";
                                                                                                                                                                   cell2.innerHTML = amountsArray[i];
                                                                                                                                                                   cell2.style.textAlign = "center";
                                                                                                                                                                   cell3.innerHTML = pricesArray[i];
                                                                                                                                                                   cell3.style.textAlign = "center";
                                                                                                                                                                   cell4.innerHTML = percentsUpFrontArray[i];
                                                                                                                                                                   cell4.style.textAlign = "center";
                                                                                                                                                                   var btn = document.createElement('input');
                                                                                                                                                                   btn.type = "button";
                                                                                                                                                                   btn.className = "tableBtn";
                                                                                                                                                                   btn.value = "Actions";
                                                                                                                                                                   btn.onclick = showEscrowActions(i, sellersArray[i], buyersArray[i], arbitersArray[i], pricesArray[i], amountsArray[i], percentsUpFrontArray[i], taxIncludedArray[i], sellerSigned[i], buyerSigned[i], sellerUnSigned[i], buyerUnSigned[i], sellerReleased[i], buyerReleased[i], buyerDisputed[i], sellerDisputed[i]);
                                                                                                                                                                   cell5.appendChild(btn);
                                                                                                                                                                   cell5.style.textAlign = "center";
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
                         
                         });

},
getTaxRate: function(){
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                                          document.getElementById("taxRate").value = taxRate
                                                          document.getElementById("taxRate2").value = taxRate
                                                          });
                         });
},
calcEscrowBuyPrice: function(){
    var totalCost = 0;
    var units = document.getElementById("escrowBuyFishAmount").value;
    var pricePerUnit = document.getElementById("escrowBuyFishPrice").value;
    var includeTax = document.getElementById("escrowBuyIncludeTax").checked;
    totalCost = units*pricePerUnit;
    if(includeTax){
        web3.eth.getAccounts(function(error, accounts) {
                             if (error) {
                             alert(error);
                             }
                             var account = accounts[0];
                             App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                                                           document.getElementById("escrowBuyCost").value = Math.floor((100+parseInt(taxRate))*totalCost/100);
                                                                           });
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
    var includeTax = document.getElementById('escrowBuyIncludeTax').checked;
    var totalCost = 0;
    var units = document.getElementById("escrowBuyFishAmount").value;
    var pricePerUnit = document.getElementById("escrowBuyFishPrice").value;
    var includeTax = document.getElementById("escrowBuyIncludeTax").checked;
    totalCost = units*pricePerUnit;
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         if (arbiter == "") {
                         arbiter = account;
                         }
                         App.contracts.Fishare.createEscrow(sellerAddress, account, arbiter, totalCost, pounds, upFrontPercent, includeTax, {from: account, gas: 250000, value: web3.toWei(cost, 'ether')}, (err, taxRate) => {});
                         });
    
},
calcEscrowSellPrice: function(){
    var totalCost = 0;
    var units = document.getElementById("escrowSellFishAmount").value;
    var pricePerUnit = document.getElementById("escrowSellFishPrice").value;
    var includeTax = document.getElementById("escrowSellIncludeTax").checked;
    totalCost = units*pricePerUnit;
    if(includeTax){
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                                                       document.getElementById("escrowSellCost").value = Math.floor((100+parseInt(taxRate))*totalCost/100);
                                                               });
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
    var buyerAddress = document.getElementById("escrowSellingBuyerAddress").value;
    if (buyerAddress == "") {
        buyerAddress = "0x0000000000000000000000000000000000000000000000000000000000000000";
    };
    var arbiter = document.getElementById("escrowSellArbiterAddress").value;
    
    var includeTax = document.getElementById('escrowSellIncludeTax').checked;
    
    if (pricePerPound < 0 || pricePerPound == null || pricePerPound == "") {
        alert("Price must be greater than 0");
    } else if (pounds < 0 || pounds == null || pounds == "") {
        alert("Amount must be greater than 0");
    } else if (upFrontPercent > 100 || upFrontPercent < 0 || upFrontPercent == null || upFrontPercent == "") {
        alert("Up front percent must be between 0 and 100");
    } else
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         if (arbiter == "") {
                         arbiter = account;
                         }
                         App.contracts.Fishare.balanceOfOwnership(account, (err, balance) => {
                                                         if(parseInt(pounds) > parseInt(balance)){
                                                            alert("Your balance is: " + balance);
                                                            return;
                                                         } else
                                                             App.contracts.Fishare.createEscrow(account, buyerAddress, arbiter, cost, pounds, upFrontPercent, includeTax, {from: account, gas: 250000}, (err, taxRate) => {});
                                                            });
                         });
    
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
    
    blankAddress = "0x0000000000000000000000000000000000000000";
    
    var table = document.getElementById("escrowSignedOrderTable");
    var escrowOrderTableCounter = 0;

    //set market price for buying if there are posted limit sell orders
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];

                         //set market price for selling if there are posted limit buy orders
                         App.contracts.Fishare.getEscrows((err, Orders) => {
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
                                                                       App.contracts.Fishare.getSellerEscrowSignatures((err, OrderSellerSigs) => {
                                                                                                                     var sellerSigned = OrderSellerSigs[0];
                                                                                                                     var sellerUnSigned = OrderSellerSigs[1];
                                                                                                                     var  sellerReleased = OrderSellerSigs[2];
                                                                                                                     var sellerDisputed = OrderSellerSigs[3];
                                                                                                                     App.contracts.Fishare.getBuyerEscrowSignatures((err, OrderBuyerSigs) => {
                                                                 
                                                                         var buyerSigned = OrderBuyerSigs[0];
                                                                         var buyerUnSigned = OrderBuyerSigs[1];
                                                                         var  buyerReleased = OrderBuyerSigs[2];
                                                                         var buyerDisputed = OrderBuyerSigs[3];
                                                                       for (var i = 0; i < amountsArray.length ; i++) {
                                                                           if(sellersArray[i] == String(account) || buyersArray[i] == String(account)){
                                                                           totalEscrowBuyOrders = totalEscrowBuyOrders + parseInt(amountsArray[i]);
                                                                           if (escrowOrderTableCounter < escrowOrderLength){
                                                                               var row = document.getElementById('EscrowRow' + i);
                                                                               row.childNodes[0].innerHTML = i;
                                                                               if(sellersArray[i] == String(account) || (String(account) != buyersArray[i] && sellersArray[i] == blankAddress)){
                                                                               row.childNodes[1].innerHTML = "Sell";
                                                                               } else if(buyersArray[i] == String(account) || (String(account) != sellersArray[i] && buyersArray[i] == blankAddress)){
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
                                                                           if(sellersArray[i] == String(account) || (String(account) != buyersArray[i] && sellersArray[i] == blankAddress)){
                                                                             cell2.innerHTML = "Sell";
                                                                           } else if(buyersArray[i] == String(account) || (String(account) != sellersArray[i] && buyersArray[i] == blankAddress)){
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
    
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         var account = accounts[0];
                         var isSeller = false;
                         var isBuyer = false;
                         var isArbiter = false;
                         if(account == seller || (account !=  buyer && seller.toString() == "0x0000000000000000000000000000000000000000")){
                         isSeller = true;
                         }
                         if(account == buyer || (account != seller && buyer.toString() == "0x0000000000000000000000000000000000000000")){
                         isBuyer = true;
                         }
                         if(account == arbiter && arbiter.toString() != "0x0000000000000000000000000000000000000000"){
                         isArbiter = true;
                         }
                         
                         document.getElementById("modalHeader").value = "Escrow Contract ID : " + id;
                         if (seller == "0x0000000000000000000000000000000000000000"){
                         document.getElementById("modalseller").value = "seller : _blank_";
                         } else {
                         document.getElementById("modalseller").value = "seller : " + seller;
                         };
                         if (buyer.toString() == "0x0000000000000000000000000000000000000000"){
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
                         
                         if (escrowOrderActionsLength == 0){
                         
                         
                         var row = table.insertRow(0);
                         row.id = 'EscrowActionRow';
                         
                         var cell1 = row.insertCell(0);
                         var cell2 = row.insertCell(1);
                         var cell3 = row.insertCell(2);
                         var cell4 = row.insertCell(3);
                         var cell5 = row.insertCell(4);
                         var cell6 = row.insertCell(5);
                         var cell7 = row.insertCell(6);
                         
                         var btn0 = document.createElement('input');
                         btn0.type = "button";
                         btn0.className = "btnEscrowModal";
                         btn0.value = "sign";
                         var btn = document.createElement('input');
                         btn.type = "button";
                         btn.className = "btnEscrowModal";
                         btn.value = "unSign";
                         var btn2 = document.createElement('input');
                         btn2.type = "button";
                         btn2.className = "btnEscrowModal";
                         btn2.value = "dispute";
                         var btn3 = document.createElement('input');
                         btn3.type = "button";
                         btn3.className = "btnEscrowModal";
                         btn3.value = "unDispute";
                         var btn4 = document.createElement('input');
                         btn4.type = "button";
                         btn4.className = "btnEscrowModal";
                         btn4.value = "finalize";
                         var btn5 = document.createElement('input');
                         btn5.type = "button";
                         btn5.className = "btnEscrowModal";
                         btn5.value = "unFinalize";
                         var btn6 = document.createElement('input');
                         btn6.type = "button";
                         btn6.className = "btnEscrowModal";
                         btn6.value = "arbitrate";
                         
                         
                         
                    if(isSeller == true){
                         if(sellerSigned == false && seller == "0x0000000000000000000000000000000000000000"){
                         btn0.onclick = signEscrow(id, 0);
                         } else {
                         btn0.style.background='#ffffff';
                         btn0.onclick = alertText("You have already signed this escrow contract.");
                         }
                         if(sellerUnSigned == false && account == seller){
                         btn.onclick = unsignEscrow(id);
                         } else {
                         btn.style.background='#ffffff';
                         btn.onclick = alertText("You have already unSigned this escrow contract.");
                         }
                         if(sellerDisputed == false && account == seller){
                         btn2.onclick = disputeEscrow(id);
                         btn3.style.background='#ffffff';
                         btn3.onclick = alertText("You have not disputed this contract.");
                         } else if(sellerDisputed == false && seller == "0x0000000000000000000000000000000000000000"){
                            btn2.style.background='#ffffff';
                            btn2.onclick = alertText("You have not signed this contract.");
                            btn3.style.background='#ffffff';
                            btn3.onclick = alertText("You have not signed this contract.");
                         } else {
                         btn2.style.background='#ffffff';
                         btn2.onclick = alertText("You have already disputed this escrow contract.");
                         btn3.onclick = unDisputeEscrow(id);
                         }
                         
                         
                         if(sellerReleased == false && account == seller){
                         btn4.onclick = releaseEscrow(id);
                         btn5.style.background='#ffffff';
                         btn5.onclick = alertText("You have not finalized this contract.");
                         } else if(sellerReleased == false && seller == "0x0000000000000000000000000000000000000000"){
                         btn4.style.background='#ffffff';
                         btn4.onclick = alertText("You have not signed this contract.");
                         btn5.style.background='#ffffff';
                         btn5.onclick = alertText("You have not signed this contract.");
                         } else {
                         btn4.style.background='#ffffff';
                         btn4.onclick = alertText("You have already released this escrow contract.");
                         btn5.onclick = unreleaseEscrow(id);
                         }
                         
                    } else if (isBuyer == true){
                         if(buyerSigned == false && buyer == "0x0000000000000000000000000000000000000000"){
                            App.contracts.Fishare.getTaxRate((err, taxRate) => {
                                                                               btn0.onclick = signEscrow(id, Math.floor((100+parseInt(taxRate))*price/100));
                                                                               });
                         
                         } else {
                         btn0.style.background='#ffffff';
                         btn0.onclick = alertText("You have already signed this escrow contract.");
                         }
                         if(buyerUnSigned == false && account == buyer){
                         btn.onclick = unsignEscrow(id);
                         } else {
                         btn.style.background='#ffffff';
                         btn.onclick = alertText("You have already unSigned this escrow contract.");
                         }
                         if(buyerDisputed == false && account == buyer){
                         btn2.onclick = disputeEscrow(id);
                         btn3.style.background='#ffffff';
                         btn3.onclick = alertText("You have not disputed this contract.");
                         } else if(buyerDisputed == false && buyer == "0x0000000000000000000000000000000000000000"){
                         btn2.style.background='#ffffff';
                         btn2.onclick = alertText("You have not signed this contract.");
                         btn3.style.background='#ffffff';
                         btn3.onclick = alertText("You have not signed this contract.");
                         } else {
                         btn2.style.background='#ffffff';
                         btn2.onclick = alertText("You have already disputed this escrow contract.");
                         btn3.onclick = unDisputeEscrow(id);
                         }
                         
                         if(buyerReleased == false && account == buyer){
                         btn4.onclick = releaseEscrow(id);
                         btn5.style.background='#ffffff';
                         btn5.onclick = alertText("You have not finalized this contract.");
                         } else if(buyerReleased == false && buyer == "0x0000000000000000000000000000000000000000"){
                         btn4.style.background='#ffffff';
                         btn4.onclick = alertText("You have not signed this contract.");
                         btn5.style.background='#ffffff';
                         btn5.onclick = alertText("You have not signed this contract.");
                         } else {
                         btn4.style.background='#ffffff';
                         btn4.onclick = alertText("You have already released this escrow contract.");
                         btn5.onclick = unreleaseEscrow(id);
                         }
                    };
                         if(isArbiter == true){
                            if(buyerDisputed == true || sellerDisputed == true){
                                if(buyerSigned == true && sellerSigned == true){
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
                         
                         escrowOrderActionsLength++;
                         };
                         
                         
                         });
     
},
signEscrow: function(arg, payment, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.signEscrow(arg, {from: accounts[0], gas: 1000000, value: payment}, (err, result) => {});
                         });
},
UnsignEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.unSignEscrow(arg, {from: accounts[0], gas: 1000000}, (err, result) => {});
                         });
},
DisputeEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.disputeEscrow(arg, {from: accounts[0], gas: 1000000}, (err, result) => {});
                         });
},
unDisputeEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.unDisputeEscrow(arg, {from: accounts[0], gas: 1000000}, (err, result) => {});
                         });
},
releaseEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.releaseEscrow(arg, {from: accounts[0], gas: 1000000}, (err, result) => {});
                         });
},
unreleaseEscrow: function(arg, accounts){
    document.getElementById("arbitrateFields").style.display = 'none';
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.unReleaseEscrow(arg, {from: accounts[0], gas: 1000000}, (err, result) => {});
                         });
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
    web3.eth.getAccounts(function(error, accounts) {
                         if (error) {
                         alert(error);
                         }
                         App.contracts.Fishare.arbitrateEscrow(id, document.getElementById("arbitrateFishSeller").value, document.getElementById("arbitrateFishBuyer").value, document.getElementById("arbitratePaymentSeller").value, document.getElementById("arbitratePaymentBuyer").value, {from: accounts[0], gas: 100000000}, (err, OrderSellerSigs) => {});
                         });
},
alertText: function(arg){
    alert(arg);
}
};

$(function() {
  $(window).load(function() {
                
    App.init();
  });
});

// close the modal window used for escrow actions
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
};
window.onclick = function(event) {

    var modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
