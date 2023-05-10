import { Component } from '@angular/core';
import { ReferralService } from '../../../shared/referral.service';
import { Web3Service } from '../../../shared/web3.service';
import { NotificationService } from '../../../shared/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-code',
  templateUrl: './my-code.component.html',
  styleUrls: ['./my-code.component.scss']
})
export class MyCodeComponent {
  myReferralCode: string = 'none';
  refferalCodeFromLocalStorage: string;
  isValidRefCode: boolean = false;
  buttonText = 'Check';
  web3AccSub?: Subscription;
  constructor(
    private referralService: ReferralService,
    private web3: Web3Service,
    private notify: NotificationService
  ) {
    const code = this.referralService.getReferralCode();
    if (code) {
      this.refferalCodeFromLocalStorage = code;
    } else {
      this.refferalCodeFromLocalStorage = '';
    }
    this.web3AccSub = web3.webUser.myAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if(this.web3.webUser.address){
      this.runAfterWeb3Init();
    }
  }

  runAfterWeb3Init() {    
    this.web3.getReferralCode(this.web3.webUser.address!).then((res) => {
      const sRes = this.referralService.bytes32ToString(res);
      this.myReferralCode = sRes;
      this.web3.getReferralInfo(res).then((res) => {  
        this.ownerRatio = res.ownerRatio;
        this.buyerRatio = res.buyerRatio;
      }
      ).catch((err) => {
        console.log(err);
      });
    }
    ).catch((err) => {
      console.log(err);
    });
  }

  ownerRatio: number = 0;
  buyerRatio: number = 0;
  checkReferralCode() {
    const refferal32 = this.referralService.stringToBytes32(this.refferalCodeFromLocalStorage);

    this.web3.getReferralInfo(refferal32).then((res) => {
      if (res.owner == '0x0000000000000000000000000000000000000000') {
        // Doesn't exist
        this.isValidRefCode = false;
        this.notify.openSnackBar('Referral code does not exist', 'OK');
        return;
      }

      if(res.owner.toLowerCase() == this.web3.webUser.address!.toLowerCase()){
        this.notify.openSnackBar('You cannot use your own referral code', 'OK');
        return;
      }

      if(this.refferalCodeFromLocalStorage == this.myReferralCode){
        this.notify.openSnackBar('Referral Code already set.', 'OK');
        return;
      }

      this.ownerRatio = res.ownerRatio;
      this.buyerRatio = res.buyerRatio;

      this.isValidRefCode = true;
    }).catch((err) => {
      console.log(err);
    });
  }

  isApplyingCode: boolean = false;
  applyCode() {
    this.isApplyingCode = true;
    this.web3.setReferralCodeAsUser
    (this.referralService.stringToBytes32(this.refferalCodeFromLocalStorage)).then((res) => {
      console.log(res);
      this.notify.openSnackBar('Referral code applied', 'OK');
      this.myReferralCode = this.refferalCodeFromLocalStorage;
      this.refferalCodeFromLocalStorage = '';      
      this.isValidRefCode = false;
      this.isApplyingCode = false;
      this.referralService.removeLocalRefferalCode();
    }
    ).catch((err) => {
      console.log(err);
      this.notify.openSnackBar('Error applying referral code', 'OK');
      this.isApplyingCode = false;
    });
  }
}
