import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  private readonly referralCodeKey = 'referralCode';

  constructor(private web3: Web3Service) { }

  referralInfo: { 
    hasReferral: boolean, 
    buyerRatio: string, 
    ownerRatio: string, 
    owner: string, 
    discountRatio: number,
    bytes32: string
  } = {
    hasReferral: false,
    buyerRatio: '0',
    ownerRatio: '0',
    owner: '0x0000000000000000000000000000000000000000',
    discountRatio: 0,
    bytes32: '0x0000000000000000000000000000000000000000000000000000000000000000',
  };

  async hasReferralCodeLocalOrChain(): Promise<[boolean, any]> {
    // Check if the user has a referral code on-chain getReferralCode(), if so, call getReferralCode() to get the buyerRatio and return it,
    // otherwise check if the user has a referral code in localStorage, if so, call getReferralInfo() to check its valid on chain and return the buyerRatio, otherwise return false.
    const primaryReferralCode = await this.web3.getReferralCode(this.web3.webUser.address!);
    if (primaryReferralCode === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      // No primary referral code on chain, check if there is one in localStorage
      const localReferralCode = this.getLocalReferralCode();
      if (localReferralCode) {
        // There is a referral code in localStorage, check if it is valid on chain
        const localReferralCodeBytes32 = this.stringToBytes32(localReferralCode);
        const localReferralInfo = await this.web3.getReferralInfo(localReferralCodeBytes32);
        if (localReferralInfo.owner === '0x0000000000000000000000000000000000000000') {
          // The referral code in localStorage is not valid on chain, remove it from localStorage
          this.removeLocalReferralCode();
          return [false, 0];
        } else {
          // The referral code in localStorage is valid on chain, check if owner is user, if so, return false, otherwise return the buyerRatio          
          if (localReferralInfo.owner.toLowerCase() == this.web3.webUser.address!.toLowerCase()) {
            return [false, 0];
          }
          const discountRatio = parseInt(localReferralInfo?.buyerRatio ?? '0');
          this.referralInfo = {...localReferralInfo, discountRatio: discountRatio, hasReferral: true, bytes32: localReferralCodeBytes32};
          return [true, this.referralInfo];
        }
      } else {
        // There is no referral code in localStorage, return false
        return [false, 0];
      }
    } else {
      // There is a primary referral code on chain, return the buyerRatio
      const primaryReferralInfo = await this.web3.getReferralInfo(primaryReferralCode);
      const discountRatio = parseInt(primaryReferralInfo?.buyerRatio ?? '0');
      this.referralInfo = {...primaryReferralInfo, discountRatio: discountRatio, hasReferral: true, bytes32: primaryReferralCode};
      return [true, this.referralInfo];
    }
  }

  setLocalReferralCode(code: string): void {
    localStorage.setItem(this.referralCodeKey, code);
  }

  getLocalReferralCode(): string | null {
    return localStorage.getItem(this.referralCodeKey);
  }

  hasLocalReferralCode(): boolean {
    return !!this.getLocalReferralCode();
  }

  updateLocalReferralCode(newCode: string): void {
    this.setLocalReferralCode(newCode);
  }

  removeLocalReferralCode(): void {
    localStorage.removeItem(this.referralCodeKey);
  }

  getLocalBytes32ReferralCode(): string {
    if (this.hasLocalReferralCode() === false) {
      // return empty bytes32 string
      return '0x'.padEnd(66, '0');
    }
    const referralCode = this.getLocalReferralCode();
    const bytes32Code = this.web3.csxInstance.web3.utils.utf8ToHex(referralCode).padEnd(66, '0');
    return bytes32Code;
  }


  /**
   * Helpers
   */

  stringToBytes32(referralCode: string): string {
    const bytes32Code = this.web3.csxInstance.web3.utils.utf8ToHex(referralCode).padEnd(66, '0');
    return bytes32Code;
  }

  bytes32ToString(bytes32: string): string {
    return this.web3.csxInstance.web3.utils.hexToUtf8(bytes32);
  }


}

