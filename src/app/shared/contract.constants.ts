import { environment } from '../../environment/environment';
import { AbiItem } from 'web3-utils';

export interface ContractInfo {
    contractAddress: string;
    abi: AbiItem[];
}

export const CONTRACTS: { [key: string]: ContractInfo } = {
    'CSXToken': {
        contractAddress: environment.CONTRACTS.CSXToken.address,
        abi: environment.CONTRACTS.CSXToken.abi as AbiItem[],
    },
    'StakedCSX': {
        contractAddress: environment.CONTRACTS.StakedCSX.address,
        abi: environment.CONTRACTS.StakedCSX.abi as AbiItem[],
    },
    'EscrowedCSX': {
        contractAddress: environment.CONTRACTS.EscrowedCSX.address,
        abi: environment.CONTRACTS.EscrowedCSX.abi as AbiItem[],
    },
    'VestedCSX': {
        contractAddress: environment.CONTRACTS.VestedCSX.address,
        abi: environment.CONTRACTS.VestedCSX.abi as AbiItem[],
    },
    'Keepers': {
        contractAddress: environment.CONTRACTS.Keepers.address,
        abi: environment.CONTRACTS.Keepers.abi as AbiItem[],
    },
    'Users': {
        contractAddress: environment.CONTRACTS.Users.address,
        abi: environment.CONTRACTS.Users.abi as AbiItem[],
    },
    'UserProfileLevel': {
        contractAddress: environment.CONTRACTS.UserProfileLevel.address,
        abi: environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
    },
    'TradeFactory': {
        contractAddress: environment.CONTRACTS.TradeFactory.address,
        abi: environment.CONTRACTS.TradeFactory.abi as AbiItem[],
    },
    'BuyAssistoor': {
        contractAddress: environment.CONTRACTS.BuyAssistoor.address,
        abi: environment.CONTRACTS.BuyAssistoor.abi as AbiItem[],
    },
    'Trade': {
        contractAddress: '',
        abi: environment.CONTRACTS.tradeContract.abi as AbiItem[],
    },
    'VestedStaking': {
        contractAddress: '',
        abi: environment.CONTRACTS.VestedStaking.abi as AbiItem[],
    },
    'USDC': {
        contractAddress: environment.CONTRACTS.Currencies.addresses.USDC,
        abi: environment.CONTRACTS.Currencies.abi as AbiItem[],
    },
    'USDT': {
        contractAddress: environment.CONTRACTS.Currencies.addresses.USDT,
        abi: environment.CONTRACTS.Currencies.abi as AbiItem[],
    },
    'WETH': {
        contractAddress: environment.CONTRACTS.Currencies.addresses.WETH,
        abi: environment.CONTRACTS.Currencies.wAbi as AbiItem[],
    }
};
