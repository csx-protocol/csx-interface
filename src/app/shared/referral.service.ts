import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service'; // Update the import path if necessary

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  private readonly referralCodeKey = 'referralCode';

  constructor(private web3: Web3Service) {}

  setReferralCode(code: string): void {
    localStorage.setItem(this.referralCodeKey, code);    
  }

  getReferralCode(): string | null {
    return localStorage.getItem(this.referralCodeKey);
  }

  hasReferralCode(): boolean {
    return !!this.getReferralCode();
  }

  updateReferralCode(newCode: string): void {
    this.setReferralCode(newCode);
  }

  getBytes32ReferralCode(): string {
    if(this.hasReferralCode() === false) {
        // return empty bytes32 string
        return '0x'.padEnd(66, '0');
    }
    const referralCode = this.getReferralCode();
    const bytes32Code = this.web3.csxInstance.window.web3.utils.utf8ToHex(referralCode).padEnd(66, '0');
    return bytes32Code;
  }

  generateBytes32ReferralCode(referralCode: string): string {
    const bytes32Code = this.web3.csxInstance.window.web3.utils.utf8ToHex(referralCode).padEnd(66, '0');
    return bytes32Code;
  }
}
