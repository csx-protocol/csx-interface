import { Component, OnDestroy } from '@angular/core';
import { ReferralService } from '../../../shared/referral.service';
import { Web3Service } from '../../../shared/web3.service';
import { NotificationService } from '../../../shared/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-code',
  templateUrl: './my-code.component.html',
  styleUrls: ['./my-code.component.scss']
})
export class MyCodeComponent implements OnDestroy {
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
    const code = this.referralService.getLocalReferralCode();
    if (code) {
      this.refferalCodeFromLocalStorage = code;
    } else {
      this.refferalCodeFromLocalStorage = '';
    }
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
  }

  baseFee: number = 2.6;
  runAfterWeb3Init() {
    this.web3.callContractMethod('ReferralRegistry', 'getReferralCode', [this.web3.webUser.address!], 'call')
      .then((res) => {
        const sRes = this.referralService.bytes32ToString(res);
        this.myReferralCode = sRes;
        this.web3.callContractMethod('ReferralRegistry', 'getReferralInfo', [res], 'call').then((res) => {
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

    this.web3.callContractMethod('ReferralRegistry', 'getReferralInfo', [refferal32], 'call').then((res) => {
      if (res.owner == '0x0000000000000000000000000000000000000000') {
        // Doesn't exist
        this.isValidRefCode = false;
        this.notify.openSnackBar('Referral code does not exist', 'OK');
        return;
      }

      if (res.owner.toLowerCase() == this.web3.webUser.address!.toLowerCase()) {
        this.notify.openSnackBar('You cannot use your own referral code', 'OK');
        return;
      }

      if (this.refferalCodeFromLocalStorage == this.myReferralCode) {
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

    this.web3.callContractMethod(
      'ReferralRegistry', 
      'setReferralCodeAsUser', 
      [this.referralService.stringToBytes32(this.refferalCodeFromLocalStorage)], 
      'send'
    ).then((res) => {
        console.log(res);
        this.notify.openSnackBar('Referral code applied', 'OK');
        this.myReferralCode = this.refferalCodeFromLocalStorage;
        this.refferalCodeFromLocalStorage = '';
        this.isValidRefCode = false;
        this.isApplyingCode = false;
        this.referralService.removeLocalReferralCode();
      }
      ).catch((err) => {
        console.log(err);
        this.notify.openSnackBar('Error applying referral code', 'OK');
        this.isApplyingCode = false;
      });
  }

  async ngOnDestroy(): Promise<void> {
    this.web3AccSub?.unsubscribe();
  }
}
