import { apis } from "./apis";

export const environment = {
  production: false,

  /**
   * Api's
   */
  steamItemsApi: apis.steamItemsApi,
  floatApi: apis.floatApi,
  /**
   * Contracts
   */
  CONTRACTS: {
    tradeFactory: {
      address: "0xc83729093587c4451e1fFB9E79fc06a4C51b8d51",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_keepers",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_users",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_tradeFactoryBaseStorage",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "enum TradeStatus",
              "name": "",
              "type": "uint8"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "data",
              "type": "string"
            }
          ],
          "name": "TradeContractStatusChange",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "assetIdFromUserAddrssToTradeAddrss",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_assetId",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "sellerAddrss",
              "type": "address"
            }
          ],
          "name": "hasAlreadyListedItem",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            }
          ],
          "name": "isThisTradeContract",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "keepersContract",
          "outputs": [
            {
              "internalType": "contract IKeepers",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            }
          ],
          "name": "onStatusChange",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_assetId",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "sellerAddrss",
              "type": "address"
            }
          ],
          "name": "removeAssetIdUsed",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "usersContract",
          "outputs": [
            {
              "internalType": "contract IUsers",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_itemMarketName",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "partner",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "token",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeUrl",
              "name": "_tradeUrl",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "_assetId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_inspectLink",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_itemImageUrl",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "_weiPrice",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "value",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "min",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "max",
                  "type": "string"
                }
              ],
              "internalType": "struct FloatInfo",
              "name": "_float",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "material",
                  "type": "string"
                },
                {
                  "internalType": "uint8",
                  "name": "slot",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "imageLink",
                  "type": "string"
                }
              ],
              "internalType": "struct Sticker[]",
              "name": "_stickers",
              "type": "tuple[]"
            },
            {
              "internalType": "string",
              "name": "_weaponType",
              "type": "string"
            }
          ],
          "name": "createListingContract",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "getTradeDetailsByIndex",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "contractAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "seller",
                  "type": "address"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "partner",
                      "type": "uint256"
                    },
                    {
                      "internalType": "string",
                      "name": "token",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct TradeUrl",
                  "name": "sellerTradeUrl",
                  "type": "tuple"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "partner",
                      "type": "uint256"
                    },
                    {
                      "internalType": "string",
                      "name": "token",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct TradeUrl",
                  "name": "buyerTradeUrl",
                  "type": "tuple"
                },
                {
                  "internalType": "string",
                  "name": "itemMarketName",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "inspectLink",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "itemImageUrl",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "weiPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "averageSellerDeliveryTime",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "string",
                      "name": "value",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "min",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "max",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct FloatInfo",
                  "name": "float",
                  "type": "tuple"
                },
                {
                  "internalType": "enum TradeStatus",
                  "name": "status",
                  "type": "uint8"
                },
                {
                  "components": [
                    {
                      "internalType": "string",
                      "name": "name",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "material",
                      "type": "string"
                    },
                    {
                      "internalType": "uint8",
                      "name": "slot",
                      "type": "uint8"
                    },
                    {
                      "internalType": "string",
                      "name": "imageLink",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct Sticker[]",
                  "name": "stickers",
                  "type": "tuple[]"
                },
                {
                  "internalType": "string",
                  "name": "weaponType",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeInfo",
              "name": "result",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tradeAddrs",
              "type": "address"
            }
          ],
          "name": "getTradeDetailsByAddress",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "contractAddress",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "seller",
                  "type": "address"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "partner",
                      "type": "uint256"
                    },
                    {
                      "internalType": "string",
                      "name": "token",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct TradeUrl",
                  "name": "sellerTradeUrl",
                  "type": "tuple"
                },
                {
                  "internalType": "address",
                  "name": "buyer",
                  "type": "address"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "partner",
                      "type": "uint256"
                    },
                    {
                      "internalType": "string",
                      "name": "token",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct TradeUrl",
                  "name": "buyerTradeUrl",
                  "type": "tuple"
                },
                {
                  "internalType": "string",
                  "name": "itemMarketName",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "inspectLink",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "itemImageUrl",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "weiPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "averageSellerDeliveryTime",
                  "type": "uint256"
                },
                {
                  "components": [
                    {
                      "internalType": "string",
                      "name": "value",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "min",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "max",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct FloatInfo",
                  "name": "float",
                  "type": "tuple"
                },
                {
                  "internalType": "enum TradeStatus",
                  "name": "status",
                  "type": "uint8"
                },
                {
                  "components": [
                    {
                      "internalType": "string",
                      "name": "name",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "material",
                      "type": "string"
                    },
                    {
                      "internalType": "uint8",
                      "name": "slot",
                      "type": "uint8"
                    },
                    {
                      "internalType": "string",
                      "name": "imageLink",
                      "type": "string"
                    }
                  ],
                  "internalType": "struct Sticker[]",
                  "name": "stickers",
                  "type": "tuple[]"
                },
                {
                  "internalType": "string",
                  "name": "weaponType",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeInfo",
              "name": "result",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "indexFrom",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxResults",
              "type": "uint256"
            }
          ],
          "name": "getTradeIndexesByStatus",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "weiPrice",
                  "type": "uint256"
                },
                {
                  "internalType": "enum PriceType",
                  "name": "priceType",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "weaponType",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "itemMarketName",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "nextIndex",
                  "type": "uint256"
                }
              ],
              "internalType": "struct TradeIndex[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "name": "getTradeCountByStatus",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ],
    },
    tradeContract: {
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_factory",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_keepers",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_users",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_seller",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_weiPrice",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_itemMarketName",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "partner",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "token",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeUrl",
              "name": "_sellerTradeUrl",
              "type": "tuple"
            },
            {
              "internalType": "string",
              "name": "_sellerAssetId",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_inspectLink",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_itemImageUrl",
              "type": "string"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "value",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "min",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "max",
                  "type": "string"
                }
              ],
              "internalType": "struct FloatInfo",
              "name": "_float",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "buyer",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "buyerCommittedTimestamp",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "buyerDeposited",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "buyerTradeUrl",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "partner",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "token",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "disputeComplaint",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "disputedStatus",
          "outputs": [
            {
              "internalType": "enum TradeStatus",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "disputeer",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "factoryContract",
          "outputs": [
            {
              "internalType": "contract ITradeFactory",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "float",
          "outputs": [
            {
              "internalType": "string",
              "name": "value",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "min",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "max",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "hasInit",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "inspectLink",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "itemImageUrl",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "itemMarketName",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "itemSellerAssetId",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "keepersContract",
          "outputs": [
            {
              "internalType": "contract IKeepers",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "seller",
          "outputs": [
            {
              "internalType": "address payable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "sellerTradeUrl",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "partner",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "token",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "status",
          "outputs": [
            {
              "internalType": "enum TradeStatus",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "stickers",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "material",
              "type": "string"
            },
            {
              "internalType": "uint8",
              "name": "slot",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "imageLink",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "usersContract",
          "outputs": [
            {
              "internalType": "contract IUsers",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "weaponType",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "weiPrice",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "name",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "material",
                  "type": "string"
                },
                {
                  "internalType": "uint8",
                  "name": "slot",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "imageLink",
                  "type": "string"
                }
              ],
              "internalType": "struct Sticker[]",
              "name": "_stickers",
              "type": "tuple[]"
            },
            {
              "internalType": "string",
              "name": "_weaponType",
              "type": "string"
            }
          ],
          "name": "initExtraInfo",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "stickerLength",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "sellerCancel",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "partner",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "token",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeUrl",
              "name": "_buyerTradeUrl",
              "type": "tuple"
            }
          ],
          "name": "commitBuy",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bool",
              "name": "isTradeMade",
              "type": "bool"
            }
          ],
          "name": "keeperNodeConfirmsTrade",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "acceptTradeOffer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "confirmReceived",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_complaint",
              "type": "string"
            }
          ],
          "name": "openDispute",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bool",
              "name": "isFavourOfBuyer",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "giveWarningToSeller",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "giveWarningToBuyer",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isWithValue",
              "type": "bool"
            }
          ],
          "name": "resolveDispute",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
    },
    keepersContract: {
      address: '0xB57A5a8b834b7C431D92829347F8580c1270e18C',
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_council",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_keeperNodeAddress",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "council",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "keepers",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "keepersIndex",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_keeper",
              "type": "address"
            }
          ],
          "name": "indexOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_keeper",
              "type": "address"
            }
          ],
          "name": "addKeeper",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_keeper",
              "type": "address"
            }
          ],
          "name": "removeKeeper",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isKeeperNode",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_newAddres",
              "type": "address"
            }
          ],
          "name": "changeKeeperNode",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_newCouncil",
              "type": "address"
            }
          ],
          "name": "changeCouncil",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "isCouncil",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ],
    },
    usersContract: {
      address: '0x931cFC25A448f90eB02a878EC39FB45c082b5ea9',
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_keepers",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "factory",
          "outputs": [
            {
              "internalType": "contract ITradeFactory",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "keepers",
          "outputs": [
            {
              "internalType": "contract IKeepers",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "users",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "reputationPos",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "reputationNeg",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalTrades",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "warnings",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isBanned",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "totalDeliveryTime",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "numberOfDeliveries",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "averageDeliveryTime",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Users.DeliveryTimes",
              "name": "deliveryInfo",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_factoryAddress",
              "type": "address"
            }
          ],
          "name": "setFactoryAddress",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "warnUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "banUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "unbanUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "getUser",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "uint256",
                  "name": "reputationPos",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "reputationNeg",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "totalTrades",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "warnings",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isBanned",
                  "type": "bool"
                },
                {
                  "components": [
                    {
                      "internalType": "uint256",
                      "name": "totalDeliveryTime",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "numberOfDeliveries",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "averageDeliveryTime",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct Users.DeliveryTimes",
                  "name": "deliveryInfo",
                  "type": "tuple"
                }
              ],
              "internalType": "struct Users.User",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "isBanned",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "startDeliveryTimer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "endDeliveryTimer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getAverageDeliveryTime",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tradeAddress",
              "type": "address"
            },
            {
              "internalType": "enum Role",
              "name": "role",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "name": "addUserInteractionStatus",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tradeAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "name": "changeUserInteractionStatus",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddrss",
              "type": "address"
            }
          ],
          "name": "getUserTotalTradeUIs",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddrss",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "i",
              "type": "uint256"
            }
          ],
          "name": "getUserTradeUIByIndex",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "contractAddress",
                  "type": "address"
                },
                {
                  "internalType": "enum Role",
                  "name": "role",
                  "type": "uint8"
                },
                {
                  "internalType": "enum TradeStatus",
                  "name": "status",
                  "type": "uint8"
                }
              ],
              "internalType": "struct UserInteraction",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            }
          ],
          "name": "getUserTradeCountByStatus",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "indexFrom",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxResults",
              "type": "uint256"
            }
          ],
          "name": "getUserTradeUIsByStatus",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "contractAddress",
                  "type": "address"
                },
                {
                  "internalType": "enum Role",
                  "name": "role",
                  "type": "uint8"
                },
                {
                  "internalType": "enum TradeStatus",
                  "name": "status",
                  "type": "uint8"
                }
              ],
              "internalType": "struct UserInteraction[]",
              "name": "",
              "type": "tuple[]"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tradeAddrs",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isPositive",
              "type": "bool"
            }
          ],
          "name": "repAfterTrade",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "tradeAddrs",
              "type": "address"
            }
          ],
          "name": "hasMadeRepOnTrade",
          "outputs": [
            {
              "internalType": "bool",
              "name": "hasBuyer",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "hasSeller",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "isTime",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ],
    },
    priceFeed: {
      isUsing: false,
      ethMockPrice: 1810,
      address: '0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08', //Goerli: 0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08 Main: 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612
      abi: [{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_accessController","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedAt","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferRequested","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accessController","outputs":[{"internalType":"contract AccessControllerInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"confirmAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint16","name":"","type":"uint16"}],"name":"phaseAggregators","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"phaseId","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"proposeAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"proposedAggregator","outputs":[{"internalType":"contract AggregatorV2V3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"proposedGetRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposedLatestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_accessController","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
    }
  },
  /**
   * Network configuration
   */
  NETWORK: {
    // Arb-Goerli 0x66eed
    chainId: '0x539',
    // 0x1691 / 0x539 Ganache
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://goerli.arbiscan.io/'],
  },
  // NETWORK: {
  //   chainId: '0xa4b1',
  //   chainName: 'Arbitrum One',
  //   nativeCurrency: {
  //     name: 'Ethereum',
  //     symbol: 'ETH',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  //   blockExplorerUrls: ['https://arbiscan.io/'],
  // },
  // NETWORK: {
  //   // GANACHE
  //   chainId: '0x539',
  //   chainName: 'Ganache',
  //   nativeCurrency: {
  //     name: 'Dev Coin',
  //     symbol: 'DEV',
  //     decimals: 18,
  //   },
  //   rpcUrls: ['http://127.0.0.1:7545'],
  //   blockExplorerUrls: [''],
  // },
};
