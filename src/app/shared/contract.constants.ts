import { environment } from '../../environment/environment';
import { AbiItem } from 'web3-utils';

export interface ContractInfo {
    address: string;
    abi: AbiItem[];
}

export const CONTRACTS: { [key: string]: ContractInfo } = {
    'CSXToken': {
        address: environment.CONTRACTS.CSXToken.address,
        abi: environment.CONTRACTS.CSXToken.abi as AbiItem[],
    },
    'StakedCSX': {
        address: environment.CONTRACTS.StakedCSX.address,
        abi: environment.CONTRACTS.StakedCSX.abi as AbiItem[],
    },
    'EscrowedCSX': {
        address: environment.CONTRACTS.EscrowedCSX.address,
        abi: environment.CONTRACTS.EscrowedCSX.abi as AbiItem[],
    },
    'VestedCSX': {
        address: environment.CONTRACTS.VestedCSX.address,
        abi: environment.CONTRACTS.VestedCSX.abi as AbiItem[],
    },
    'Keepers': {
        address: environment.CONTRACTS.Keepers.address,
        abi: environment.CONTRACTS.Keepers.abi as AbiItem[],
    },
    'Users': {
        address: environment.CONTRACTS.Users.address,
        abi: environment.CONTRACTS.Users.abi as AbiItem[],
    },
    'UserProfileLevel': {
        address: environment.CONTRACTS.UserProfileLevel.address,
        abi: environment.CONTRACTS.UserProfileLevel.abi as AbiItem[],
    },
    'ReferralRegistry': {
        address: environment.CONTRACTS.ReferralRegistry.address,
        abi: environment.CONTRACTS.ReferralRegistry.abi as AbiItem[],
    },
    'TradeFactory': {
        address: environment.CONTRACTS.TradeFactory.address,
        abi: environment.CONTRACTS.TradeFactory.abi as AbiItem[],
    },
    'BuyAssistoor': {
        address: environment.CONTRACTS.BuyAssistoor.address,
        abi: environment.CONTRACTS.BuyAssistoor.abi as AbiItem[],
    },
    'Trade': {
        address: '',
        abi: environment.CONTRACTS.tradeContract.abi as AbiItem[],
    },
    'VestedStaking': {
        address: '',
        abi: environment.CONTRACTS.VestedStaking.abi as AbiItem[],
    },
    'USDC': {
        address: environment.CONTRACTS.Currencies.addresses.USDC,
        abi: environment.CONTRACTS.Currencies.abi as AbiItem[],
    },
    'USDT': {
        address: environment.CONTRACTS.Currencies.addresses.USDT,
        abi: environment.CONTRACTS.Currencies.abi as AbiItem[],
    },
    'WETH': {
        address: environment.CONTRACTS.Currencies.addresses.WETH,
        abi: environment.CONTRACTS.Currencies.wAbi as AbiItem[],
    }
};
