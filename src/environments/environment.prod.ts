export const environment = {
  production: true,

  /**
   * Api's s
   */
  steamItemsApi: (process.env["NG_APP_ITEMS_API"]! as string),
  floatApi: (process.env["NG_APP_FLOAT_API"]! as string),
  /**
   * Contracts
   */
  CONTRACTS: {
    CSXToken: {
      address: "0x9C93605e005816DD7729175BDaa589d36c90534E",
      abi: [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
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
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burnFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
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
          "name": "maxSupply",
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
          "name": "name",
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
          "name": "symbol",
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
          "name": "totalSupply",
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
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    },
    StakedCSX: {
      address: "0xCf8094E6263cF2F14eA2fd663e9D41ea4a4bA2BA",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_csxToken",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_wethToken",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usdcToken",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usdtToken",
              "type": "address"
            },
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
          "name": "AmountMustBeGreaterThanZero",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "AmountSurpassesMaxSupply",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "EthTransferFailed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InsufficientBalance",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidSender",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidToken",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidUser",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoTokensMinted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TokenTransferFailed",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "reward",
              "type": "uint256"
            }
          ],
          "name": "ClaimReward",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "token",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "DepositedDividend",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "wethAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "usdcAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "usdtAmount",
              "type": "uint256"
            }
          ],
          "name": "Distribute",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Stake",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
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
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Unstake",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "DIVISION",
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
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
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
              "internalType": "bool",
              "name": "claimUsdc",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "claimUsdt",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "claimWeth",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "convertWethToEth",
              "type": "bool"
            }
          ],
          "name": "claim",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "_token",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_reward",
              "type": "uint256"
            }
          ],
          "name": "depositDividend",
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
          "inputs": [
            {
              "internalType": "bool",
              "name": "dWeth",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "dUsdc",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "dUsdt",
              "type": "bool"
            }
          ],
          "name": "distribute",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
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
          "name": "keepers",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "lastRewardRate",
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
          "name": "name",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "nonDistributedRewardsPerToken",
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
              "internalType": "address",
              "name": "_account",
              "type": "address"
            }
          ],
          "name": "rewardOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "usdcAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "usdtAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "wethAmount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "rewardRate",
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
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "roundingErrors",
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
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "stake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
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
          "name": "tokenCSX",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tokenUSDC",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tokenUSDT",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tokenWETH",
          "outputs": [
            {
              "internalType": "contract IWETH",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
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
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "unStake",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]
    },
    Currencies: {
      addresses: {
        USDC: "0x209b572e89187c6472a786474C52f551BB226E2c",
        USDT: "0xB83E20891A423eEccD7341476feACd0a4d10a139",
        WETH: "0xA1887504AdE7085fB4873dB6507C22F3Bd479978",
      },
      abi: [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
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
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
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
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
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
          "name": "maxSupply",
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
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [],
          "name": "totalSupply",
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
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
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
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "pure",
          "type": "function",
          "constant": true
        }
      ],
      wAbi: [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "src",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "guy",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "dst",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "Deposit",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "src",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "dst",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "wad",
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
              "internalType": "address",
              "name": "src",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "Withdrawal",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "allowance",
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
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "balanceOf",
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
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
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
          "name": "symbol",
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
          "stateMutability": "payable",
          "type": "receive"
        },
        {
          "inputs": [],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "totalSupply",
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
              "internalType": "address",
              "name": "guy",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "approve",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "dst",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "transfer",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "src",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "dst",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "wad",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]
    },
    EscrowedCSX: {
      address: "0x01Ac21cAB815604a78E0ca720925129824899d27",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_csxToken",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "AlreadyInitialized",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "AmountMustBeGreaterThanZero",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyDeployerCanInitialize",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Claimed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Minted",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
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
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burnFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "csxToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "_vCSXToken",
              "type": "address"
            }
          ],
          "name": "init",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "isInitialized",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_amount",
              "type": "uint256"
            }
          ],
          "name": "mintEscrow",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
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
          "name": "symbol",
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
          "name": "totalSupply",
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
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
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
          "name": "vestedCSX",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
    },
    VestedCSX: {
      address: "0x1D2D80111da040134d2108abBB51eb01aF0afC3b",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_eCsxAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_sCsxAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_wethAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usdcAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_csxAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usdtAddress",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "AmountMustBeGreaterThanZero",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "AmountSurpassesMaxSupply",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TokenTransfersDisabled",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "CSX",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "EscrowedCSX",
          "outputs": [
            {
              "internalType": "contract IERC20Burnable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "MAX_SUPPLY",
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
          "name": "StakedCSX",
          "outputs": [
            {
              "internalType": "contract IStakedCSX",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "USDC",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "USDT",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "WETH",
          "outputs": [
            {
              "internalType": "contract IWETH",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            }
          ],
          "name": "allowance",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            }
          ],
          "name": "balanceOf",
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
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "account",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burnFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "internalType": "uint8",
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
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "subtractedValue",
              "type": "uint256"
            }
          ],
          "name": "decreaseAllowance",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getVestedStakingContractAddress",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "addedValue",
              "type": "uint256"
            }
          ],
          "name": "increaseAllowance",
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
          "name": "name",
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
          "name": "symbol",
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
          "name": "totalSupply",
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
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transfer",
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
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "vest",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "vestedStakingContractPerUser",
          "outputs": [
            {
              "internalType": "contract VestedStaking",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
    },
    Keepers: {
      address: '0x45f2CDC9892b906dc3FBFdAE905407c7C04e215d',
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
          "name": "KeeperAlreadyExists",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotAKeeper",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotCouncil",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "newCouncil",
              "type": "address"
            }
          ],
          "name": "CouncilChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "newKeeper",
              "type": "address"
            }
          ],
          "name": "KeeperAdded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "newKeeperNode",
              "type": "address"
            }
          ],
          "name": "KeeperNodeChanged",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "keeper",
              "type": "address"
            }
          ],
          "name": "KeeperRemoved",
          "type": "event"
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
          "name": "indexOf",
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
          "name": "isKeeper",
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
          "name": "keepers",
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
        }
      ],
    },
    Users: {
      address: '0xf6E9507Ba5909c6EBe4a283623d3BAd13b0b73F9',
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
          "name": "AlreadyRepresentedAsBuyer",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "AlreadyRepresentedAsSeller",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotCouncil",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotFactory",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotKeepersOrTradeContract",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotPartOfTrade",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotTradeContract",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TradeNotCompleted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ZeroTradeAddress",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "seller",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "refCode",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "enum PriceType",
              "name": "priceType",
              "type": "uint8"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "NewTrade",
          "type": "event"
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
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
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
              "name": "_factoryAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_keepers",
              "type": "address"
            }
          ],
          "name": "changeContracts",
          "outputs": [],
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
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "refCode",
              "type": "bytes32"
            },
            {
              "internalType": "enum PriceType",
              "name": "priceType",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "emitNewTrade",
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
          "name": "getUserData",
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
                      "name": "totalStarts",
                      "type": "uint256"
                    },
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
                },
                {
                  "internalType": "uint256",
                  "name": "totalTradesAsSeller",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "totalTradesAsBuyer",
                  "type": "uint256"
                }
              ],
              "internalType": "struct Users.User",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
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
          "type": "function"
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
          "name": "hasAlreadyListedItem",
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
          "name": "isBanned",
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
          "name": "keepers",
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
              "internalType": "string",
              "name": "_assetId",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "sellerAddrss",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "tradeAddrss",
              "type": "address"
            }
          ],
          "name": "setAssetIdUsed",
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
                  "name": "totalStarts",
                  "type": "uint256"
                },
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
            },
            {
              "internalType": "uint256",
              "name": "totalTradesAsSeller",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalTradesAsBuyer",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
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
        }
      ],
    },
    UserProfileLevel: {
      address: "0x9B319d09d66FBa4D10a440502E3B32836F08E094",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_tokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usersContractAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_keepersContractAddress",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "InsufficientTokens",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NewAddressNotEmpty",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoLevelsToTransfer",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoPendingTransfer",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotCouncil",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TransferToSelf",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "UserBanned",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ZeroLevels",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "newLevel",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "numberOfLevelsIncreased",
              "type": "uint256"
            }
          ],
          "name": "ProfileLeveledUp",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_originalOwner",
              "type": "address"
            }
          ],
          "name": "acceptTransfer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "cancelTransfer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_usersContractAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_keepersContractAddress",
              "type": "address"
            }
          ],
          "name": "changeContracts",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "levels",
              "type": "uint256"
            }
          ],
          "name": "getCostForNextLevels",
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
              "internalType": "uint256",
              "name": "currentLevel",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "levels",
              "type": "uint256"
            }
          ],
          "name": "getLevelUpCost",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            }
          ],
          "name": "getUserData",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
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
              "internalType": "address",
              "name": "userAddress",
              "type": "address"
            }
          ],
          "name": "getUserLevel",
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
              "internalType": "address",
              "name": "newAddress",
              "type": "address"
            }
          ],
          "name": "initiateTransfer",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_tokenAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_levels",
              "type": "uint256"
            }
          ],
          "name": "levelUp",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "pendingTransfers",
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
              "name": "level",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
    },
    ReferralRegistry: {
      address: "0x308337bb45Bb02ADEB4A3Ed8E033BDF9D8370375",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "provided",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "max",
              "type": "uint256"
            }
          ],
          "name": "InvalidDiscountRatio",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            }
          ],
          "name": "InvalidRatios",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            }
          ],
          "name": "InvalidReferralCode",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotTradeContract",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            }
          ],
          "name": "OwnerOfReferralCode",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            }
          ],
          "name": "ReferralCodeAlreadySet",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            }
          ],
          "name": "ReferralCodeNotRegistered",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "reason",
              "type": "string"
            }
          ],
          "name": "Unauthorized",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "paymentToken",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "rebate",
              "type": "uint256"
            }
          ],
          "name": "ReferralCodeRebateUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "ownerRatio",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "buyerRatio",
              "type": "uint256"
            }
          ],
          "name": "ReferralCodeRegistered",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "fullItemPrice",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isBuyerAffiliated",
              "type": "bool"
            },
            {
              "internalType": "uint256",
              "name": "baseFeePercentTen",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "discountRatio",
              "type": "uint256"
            }
          ],
          "name": "calculateNetValue",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "buyerNetPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "sellerNetProceeds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "affiliatorNetReward",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenHoldersNetReward",
              "type": "uint256"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
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
            }
          ],
          "name": "changeContracts",
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
              "name": "_paymentToken",
              "type": "address"
            },
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "rebate",
              "type": "uint256"
            }
          ],
          "name": "emitReferralCodeRebateUpdated",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
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
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "paymentToken",
              "type": "address"
            }
          ],
          "name": "getRebatePerCodePerPaymentToken",
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
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "getReferralCode",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            }
          ],
          "name": "getReferralCodeOwner",
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
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            }
          ],
          "name": "getReferralCodeRatios",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "ownerRatio",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "buyerRatio",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
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
          "name": "getReferralCodesByUser",
          "outputs": [
            {
              "internalType": "bytes32[]",
              "name": "",
              "type": "bytes32[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            }
          ],
          "name": "getReferralInfo",
          "outputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "ownerRatio",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "buyerRatio",
                  "type": "uint256"
                }
              ],
              "internalType": "struct ReferralRegistry.ReferralInfo",
              "name": "",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            }
          ],
          "name": "isReferralCodeRegistered",
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
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "ownerRatio",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "buyerRatio",
              "type": "uint256"
            }
          ],
          "name": "registerReferralCode",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            }
          ],
          "name": "setReferralCodeAsTC",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "referralCode",
              "type": "bytes32"
            }
          ],
          "name": "setReferralCodeAsUser",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
    },
    TradeFactory: {
      address: "0x1618474a7061a0Bd68b4DC87E7FEC3FC4e294DD5",
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
            },
            {
              "internalType": "uint256",
              "name": "_baseFee",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "weth",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "usdc",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "usdt",
                  "type": "address"
                }
              ],
              "internalType": "struct PaymentTokens",
              "name": "_paymentTokens",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "_referralRegistryAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_sCSXTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_buyAssistoor",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "AssetIDAlreadyExists",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_address",
              "type": "address"
            }
          ],
          "name": "InvalidAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidPriceType",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoTradeCreated",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotCouncil",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotTradeContract",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "UserBanned",
          "type": "error"
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
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "sellerAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "buyerAddress",
              "type": "address"
            }
          ],
          "name": "TradeContractStatusChange",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "baseFee",
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
          "name": "buyAssistoor",
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
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_baseFee",
              "type": "uint256"
            }
          ],
          "name": "changeBaseFee",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
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
          "name": "changeContracts",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "weth",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "usdc",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "usdt",
                  "type": "address"
                }
              ],
              "internalType": "struct PaymentTokens",
              "name": "_paymentTokens",
              "type": "tuple"
            },
            {
              "internalType": "address",
              "name": "_referralRegistryAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_sCSXTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_buyAssistoor",
              "type": "address"
            }
          ],
          "name": "changeContractsForTrade",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "itemMarketName",
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
                  "name": "tradeUrl",
                  "type": "tuple"
                },
                {
                  "internalType": "string",
                  "name": "assetId",
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
                  "components": [
                    {
                      "internalType": "string",
                      "name": "floatValues",
                      "type": "string"
                    },
                    {
                      "internalType": "uint256",
                      "name": "paintSeed",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "paintIndex",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct SkinInfo",
                  "name": "skinInfo",
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
                  "name": "stickers",
                  "type": "tuple[]"
                },
                {
                  "internalType": "string",
                  "name": "weaponType",
                  "type": "string"
                },
                {
                  "internalType": "enum PriceType",
                  "name": "priceType",
                  "type": "uint8"
                }
              ],
              "internalType": "struct ListingParams",
              "name": "params",
              "type": "tuple"
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
                      "name": "floatValues",
                      "type": "string"
                    },
                    {
                      "internalType": "uint256",
                      "name": "paintSeed",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "paintIndex",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct SkinInfo",
                  "name": "skinInfo",
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
                },
                {
                  "internalType": "enum PriceType",
                  "name": "priceType",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "assetId",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeInfo",
              "name": "result",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
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
                      "name": "floatValues",
                      "type": "string"
                    },
                    {
                      "internalType": "uint256",
                      "name": "paintSeed",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "paintIndex",
                      "type": "uint256"
                    }
                  ],
                  "internalType": "struct SkinInfo",
                  "name": "skinInfo",
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
                },
                {
                  "internalType": "enum PriceType",
                  "name": "priceType",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "assetId",
                  "type": "string"
                }
              ],
              "internalType": "struct TradeInfo",
              "name": "result",
              "type": "tuple"
            }
          ],
          "stateMutability": "view",
          "type": "function"
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
          "type": "function"
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
          "inputs": [
            {
              "internalType": "enum TradeStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "enum TradeStatus",
              "name": "prevStatus",
              "type": "uint8"
            },
            {
              "internalType": "string",
              "name": "data",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "sellerAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "buyerAddress",
              "type": "address"
            }
          ],
          "name": "onStatusChange",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "paymentTokens",
          "outputs": [
            {
              "internalType": "address",
              "name": "weth",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "usdc",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "usdt",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "referralRegistryAddress",
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
          "name": "sCSXTokenAddress",
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
          "name": "totalContracts",
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
              "internalType": "enum TradeStatus",
              "name": "",
              "type": "uint8"
            }
          ],
          "name": "tradeCountByStatus",
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
        }
      ],
    },
    BuyAssistoor: {
      address: "0xF916f447E9C634ABF27B1A10591c4f6063DA0d05",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_weth",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "EthDepositFailed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidPriceType",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidTradeContract",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "WethApprovalFailed",
          "type": "error"
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
            },
            {
              "internalType": "bytes32",
              "name": "_affLink",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "_tradeContract",
              "type": "address"
            }
          ],
          "name": "BuyWithEthToWeth",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "weth",
          "outputs": [
            {
              "internalType": "contract IWETH",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
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
                  "name": "floatValues",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "paintSeed",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "paintIndex",
                  "type": "uint256"
                }
              ],
              "internalType": "struct SkinInfo",
              "name": "_skinInfo",
              "type": "tuple"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "DividendDepositFailed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotCommitted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotFactory",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotForSale",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotGroup",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotKeeperNode",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotKeeperOrNode",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotParty",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotSeller",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "StatusNotBuyerCommitted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "StatusNotDisputeReady",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "StatusNotSellerCommitted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TimeNotElapsed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TradeIDNotRemoved",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "buyer",
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
          "name": "buyerCancel",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "buyerCommitTimestamp",
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
          "name": "buyerConfirmReceived",
          "outputs": [],
          "stateMutability": "nonpayable",
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
            },
            {
              "internalType": "bytes32",
              "name": "_affLink",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "_buyerAddress",
              "type": "address"
            }
          ],
          "name": "commitBuy",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "depositedValue",
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
          "name": "finalityResult",
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
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "_affLink",
              "type": "bytes32"
            }
          ],
          "name": "getNetValue",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "buyerNetPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "sellerNetProceeds",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "affiliatorNetReward",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenHoldersNetReward",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getStatusCount",
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
            },
            {
              "internalType": "address",
              "name": "_paymentToken",
              "type": "address"
            },
            {
              "internalType": "enum PriceType",
              "name": "_priceType",
              "type": "uint8"
            },
            {
              "internalType": "address",
              "name": "_referralRegistryContract",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_sCSXToken",
              "type": "address"
            }
          ],
          "name": "initExtraInfo",
          "outputs": [],
          "stateMutability": "nonpayable",
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
          "inputs": [
            {
              "internalType": "bool",
              "name": "isTradeMade",
              "type": "bool"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            }
          ],
          "name": "keeperNodeConfirmsTrade",
          "outputs": [],
          "stateMutability": "nonpayable",
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
          "inputs": [],
          "name": "paymentToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "priceType",
          "outputs": [
            {
              "internalType": "enum PriceType",
              "name": "",
              "type": "uint8"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "referralCode",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "referralRegistryContract",
          "outputs": [
            {
              "internalType": "contract IReferralRegistry",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
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
        },
        {
          "inputs": [],
          "name": "sCSXToken",
          "outputs": [
            {
              "internalType": "contract IStakedCSX",
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
          "name": "sellerAcceptedTimestamp",
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
          "inputs": [],
          "name": "sellerConfirmsTrade",
          "outputs": [],
          "stateMutability": "nonpayable",
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
          "inputs": [
            {
              "internalType": "bool",
              "name": "_sellerCommited",
              "type": "bool"
            }
          ],
          "name": "sellerTradeVeridict",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "skinInfo",
          "outputs": [
            {
              "internalType": "string",
              "name": "floatValues",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "paintSeed",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "paintIndex",
              "type": "uint256"
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
          "name": "statusHistory",
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
        }
      ]
    },
    VestedStaking: {
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_vesterAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_sCsxTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_vCsxTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_csxTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usdcTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_usdtTokenAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_wethTokenAddress",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "InvalidSender",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotEnoughTokens",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyVCSXContract",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyVesterAllowed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TokensAreStillLocked",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TransferFailed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "VESTING_PERIOD",
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
              "internalType": "bool",
              "name": "claimUsdc",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "claimUsdt",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "claimWeth",
              "type": "bool"
            },
            {
              "internalType": "bool",
              "name": "convertWethToEth",
              "type": "bool"
            }
          ],
          "name": "claimRewards",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "csxToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "deposit",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getClaimableAmountAndVestTimeStart",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "usdcAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "usdtAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "wethAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "vestTimeStart",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "sCsxToken",
          "outputs": [
            {
              "internalType": "contract IStakedCSX",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "usdcToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "usdtToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "vCsxToken",
          "outputs": [
            {
              "internalType": "contract IERC20Burnable",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "vesterAddress",
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
          "name": "vesting",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "wethToken",
          "outputs": [
            {
              "internalType": "contract IERC20",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "withdraw",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ]
    },
    priceFeed: {
      isUsing: true,
      ethMockPrice: 1535,
      address: '0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08', //Goerli: 0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08 Main: 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612
      abi: [{ "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }, { "internalType": "address", "name": "_accessController", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "int256", "name": "current", "type": "int256" }, { "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "updatedAt", "type": "uint256" }], "name": "AnswerUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "roundId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "startedBy", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "startedAt", "type": "uint256" }], "name": "NewRound", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferRequested", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "acceptOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "accessController", "outputs": [{ "internalType": "contract AccessControllerInterface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "aggregator", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }], "name": "confirmAggregator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_roundId", "type": "uint256" }], "name": "getAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_roundId", "type": "uint256" }], "name": "getTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestAnswer", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRound", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestTimestamp", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "name": "phaseAggregators", "outputs": [{ "internalType": "contract AggregatorV2V3Interface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "phaseId", "outputs": [{ "internalType": "uint16", "name": "", "type": "uint16" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_aggregator", "type": "address" }], "name": "proposeAggregator", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "proposedAggregator", "outputs": [{ "internalType": "contract AggregatorV2V3Interface", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "proposedGetRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "proposedLatestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_accessController", "type": "address" }], "name": "setController", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_to", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    }
  },
  /**
   * Network configuration
   */
  NETWORK: {
    chainId: '0x66eed',
    // 0x1691 / 0x539 Ganache / 0x7a69 Hardhat / 0xa4b1 Goerli / 0x66eed Arb-Goerli
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