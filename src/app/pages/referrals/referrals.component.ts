import { Component } from '@angular/core';
import { ReferralService } from '../../shared/referral.service';
import { Web3Service } from '../../shared/web3.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent {
 refferalCode: string;
 initReferralCode: string;
 constructor(public web3: Web3Service, private referralService: ReferralService) {
    const code = this.referralService.getReferralCode();
    if (code) {
      this.refferalCode = code;
      this.initReferralCode = code;
    } else {
      this.refferalCode = '';
      this.initReferralCode = '';
    }
 }

 isValidRefCode: boolean = false;
 checkReferralCode() {
  const refferal32 = this.referralService.generateBytes32ReferralCode(this.refferalCode);
   this.web3.getReferralInfo(refferal32).then((res) => {
      console.log(res);
      if(res.owner == '0x0000000000000000000000000000000000000000'){
        // Doesn't exist
      } else {
        // Exists
      }
    }).catch((err) => {
      console.log(err);
    });
 }
 
}
