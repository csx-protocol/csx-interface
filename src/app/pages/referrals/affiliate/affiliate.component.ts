import { Component, ViewChild } from '@angular/core';
import { ReferralService } from '../../../shared/referral.service';
import { Web3Service } from '../../../shared/web3.service';
import { NotificationService } from '../../../shared/notification.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { environment } from '../../../../environment/environment';
import { Sort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import Web3 from 'web3';

interface Rebate {
  token: string;
  rebate: string;
}

export interface ReferralRebateData {
  codeString: string;
  code: string;
  rebates: Rebate[];
  buyerRatio: string;
  sellerRatio: string;
}

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.scss'],
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate(150),
      ]),
      transition('* => void', [
        animate(150, style({ opacity: 0, transform: 'scale(0.5)' })),
      ]),
    ]),
  ],
})
export class AffiliateComponent {
  state = 'in';
  refferalCode: string = '';
  firstFormGroup: FormBuilder | any;
  secondFormGroup: FormBuilder | any;
  @ViewChild('stepper') stepper: MatStepper | undefined;
  @ViewChild('tabGroup') tabGroup: MatTabGroup | undefined;

  displayedColumns: string[] = ['referralCode', 'buyerRatio', 'sellerRatio', 'rebateETH', 'rebateUSDC', 'rebateUSDT'];

  rebates: ReferralRebateData[] = [];

  isLoading: boolean = false;
  loadCount = '1';
  constructor(public web3: Web3Service, private referralService: ReferralService, private notify: NotificationService, private _formBuilder: FormBuilder,) {
    this.isLoading = true;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      scndCtrl: [50, Validators.required],
    });


  }

  async getRebates(): Promise<ReferralRebateData[]> {
    const refCodes = await this.web3.callContractMethod('ReferralRegistry', 'getReferralCodesByUser', [this.web3.webUser.address!], 'call');
    this.loadCount = ((refCodes.length - this.rebates.length)).toString();
    const rebates = await this._getRebatesFromBytes32Codes(refCodes);
    return rebates;
  }

  private async _getRebatesFromBytes32Codes(codes: string[]): Promise<any> {
    let rebates: ReferralRebateData[] = [];
    for (const code of codes) {
      const rebate = await this.__getRebatesFromBytes32Code(code);
      const ratios = await this.web3.callContractMethod('ReferralRegistry', 'getReferralInfo', [code], 'call')
      const reb: ReferralRebateData = {
        codeString: this.referralService.bytes32ToString(code),
        code: code,
        rebates: rebate,
        buyerRatio: ratios.buyerRatio,
        sellerRatio: ratios.ownerRatio
      };
      rebates.push(reb);
    }
    return rebates;
  }

  private async __getRebatesFromBytes32Code(code: string): Promise<any> {

    const paymentTokens = [
      {
        name: 'USDC',
        address: environment.CONTRACTS.Currencies.addresses.USDC
      },
      {
        name: 'USDT',
        address: environment.CONTRACTS.Currencies.addresses.USDT
      },
      {
        name: 'WETH',
        address: environment.CONTRACTS.Currencies.addresses.WETH
      },
    ]

    let rebates: Rebate[] = [];

    for (const token of paymentTokens) {
      const rebate =
        await this.web3.callContractMethod('ReferralRegistry', 'getRebatePerCodePerPaymentToken', [code, token.address], 'call');
      const reb: Rebate = { token: token.name, rebate: rebate };
      rebates.push(reb);
    }

    return rebates;
  }

  onClickCheckAvailability() {
    if (this.firstFormGroup.valid) {
      // Check that the referral code is valid (not used).
      // Get the referral code from the input.
      //  <input (keydown)="onKeydown($event)" matInput formControlName="firstCtrl" required maxlength="43">
      const stringCode = this.firstFormGroup.value.firstCtrl;
      // Convert to bytes32
      this.refferalCode = this.referralService.stringToBytes32(stringCode);

      this.web3.callContractMethod('ReferralRegistry', 'getReferralInfo', [this.refferalCode], 'call').then((res: any) => {
        if (res[0] === '0x0000000000000000000000000000000000000000') {
          //this.referralService.setReferralCode(this.refferalCode);
          //this.notify.openSnackBar('Referral code available!', '👍');
          this.stepper!.next();
        } else {
          this.notify.openSnackBar('Referral code already in use', '😭');
        }
      });

    } else {
      this.notify.openSnackBar('Invalid referral code', 'OK');
    }
  }

  isCreatingCode = false;
  onClickCreateCode() {
    if (this.secondFormGroup.valid) {
      this.isCreatingCode = true;
      const rebate = this.secondFormGroup.value.scndCtrl;
      const discount = (100 - rebate).toString();
      console.log(rebate, discount);

      // registerReferralCode with this.refferalCode
      this.web3.callContractMethod('ReferralRegistry', 'registerReferralCode', [this.refferalCode, rebate, discount], 'send'
      ).then((res: any) => {
        console.log(res);
        this.isCreatingCode = false;
        this.notify.openSnackBar('Referral code created!', '👍');
        // reset the form
        this.firstFormGroup.reset();
        this.refferalCode = '';
        this.secondFormGroup.value.scndCtrl = 50;
        this.firstFormGroup.value.firstCtrl = '';
        this.stepper!.previous();
        this.tabGroup!.selectedIndex = 1;
        // Push the new code to the table

      }).catch((err: any) => {
        console.log(err);
        this.isCreatingCode = false;
        this.notify.openSnackBar('Error creating referral code', '😭');
      });
    } else {
      this.notify.openSnackBar('Invalid percentage', 'OK');
    }

  }

  onKeydown(event: any) {
    if (event.keyCode === 32) {
      return false;
    }
    return true;
  }

  tabChange(event: any) {
    if (event.index === 1) {
      this.isLoading = true;
      this.getRebates().then((rebates: ReferralRebateData[]) => {
        this.rebates = rebates;
        this.isLoading = false;
      });
    }
  }

  sortData(sort: Sort) {
    const data = this.rebates.slice();
    if (!sort.active || sort.direction === '') {
      this.rebates = data;
      return;
    }

    this.rebates = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'referralCode': return this._compare(a.codeString, b.codeString, isAsc);
        case 'rebateETH': return this._compare(a.rebates[2].rebate, b.rebates[2].rebate, isAsc); //Make sure they are not in wei and full eth (with 18 decimals) eth as string parsed to int
        case 'rebateUSDC': return this._compare(a.rebates[0].rebate, b.rebates[0].rebate, isAsc); //Make sure they are not in wei and full eth (with 6 decimals) as string parsed to int
        case 'rebateUSDT': return this._compare(a.rebates[1].rebate, b.rebates[1].rebate, isAsc); //Make sure they are not in wei and full eth (with 6 decimals) as string parsed to int
        case 'buyerRatio': return this._compare(parseInt(a.buyerRatio), parseInt(b.buyerRatio), isAsc);
        case 'sellerRatio': return this._compare(parseInt(a.sellerRatio), parseInt(b.sellerRatio), isAsc);
        default: return 0;
      }
    });
  }

  _compare(a: any, b: any, isAsc: boolean) {
    if (typeof a === 'number' && typeof b === 'number') {
      return (a - b) * (isAsc ? 1 : -1);
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  addCommas(_num: string, _decimals: number) {
    // this.stakeInfo.weth.wei = res.wethAmount;
    // this.stakeInfo.usdc.wei = res.usdcAmount;
    // this.stakeInfo.usdt.wei = res.usdtAmount;

    if (_decimals === 18) {
      // const num = parseFloat(_num).toFixed(4);
      // return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parseFloat(this.web3.csxInstance.web3.utils.fromWei(_num, 'ether')).toFixed(4);
    }

    const tenPowerDecimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(_decimals));

    const stableBalanceBN = Web3.utils.toBN(_num);
    const stableBalanceInteger = stableBalanceBN.div(tenPowerDecimals).toString(10);
    const stableBalanceFraction = stableBalanceBN.mod(tenPowerDecimals).toString(10).padStart(_decimals, '0');
    return parseFloat(`${stableBalanceInteger}.${stableBalanceFraction}`).toFixed(2);
  }

}
