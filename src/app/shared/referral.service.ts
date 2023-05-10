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

  removeLocalRefferalCode(): void {
    localStorage.removeItem(this.referralCodeKey);
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

  stringToBytes32(referralCode: string): string {
    const bytes32Code = this.web3.csxInstance.window.web3.utils.utf8ToHex(referralCode).padEnd(66, '0');
    return bytes32Code;
  }

  //Converts bytes32 to string
  bytes32ToString(bytes32: string): string {
    return this.web3.csxInstance.window.web3.utils.hexToUtf8(bytes32);
  }
}
