import { Injectable } from '@angular/core';
import { Web3Service } from '../../../../shared/web3.service';

@Injectable({
  providedIn: 'root',
})
export class BuyerCommittedService {
  constructor(public web3: Web3Service) {
  }

  // isLoading: boolean = true;

  cancelTrade(contractAddress: string) {
    this.web3.cancelTrade(contractAddress);
  }

  async getBuyerCommitTimestamp(contractAddress: string) {
    return await this.web3.getVariableFromTradeContract(contractAddress, 'buyerCommitTimestamp');
  }
}

