import { Injectable } from '@angular/core';
import { Web3Service } from '../../../../shared/web3.service';

@Injectable({
  providedIn: 'root',
})
export class BuyerCommittedService {
  constructor(public web3: Web3Service) {
  }

  // isLoading: boolean = true;

  async cancelTrade(contractAddress: string, isBuyer: boolean) {
    return await this.web3.cancelTrade(contractAddress, isBuyer);
  }

  async sellerTradeVeridict(contractAddress: string, isBuyer: boolean) {
    return await this.web3.sellerTradeVeridict(contractAddress, isBuyer);
  }

  async getBuyerCommitTimestamp(contractAddress: string) {
    return await this.web3.getVariableFromTradeContract(contractAddress, 'buyerCommitTimestamp');
  }
}

