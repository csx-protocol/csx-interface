import { Component, Inject, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Item } from "../../../shared/item.interface";
import { Web3Service } from "../../../shared/web3.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ReferralService } from "../../../shared/referral.service";
import { TradeLinkService } from "../../../shared/trade-link-url.service";
import { MatStepper } from "@angular/material/stepper";
import { NotificationService } from "../../../shared/notification.service";

@Component({
  selector: 'buy-dialog',
  templateUrl: './buy.dialog.html',
  styleUrls: ['./buy.dialog.scss'],
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
export class BuyDialog {
  state = 'in'; // for animation
  isInMinutes: boolean = false;

  @ViewChild('stepper') stepper: MatStepper | undefined;

  item: Item;

  firstFormGroup: FormBuilder | any;

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', /*Validators.required*/],
  });
  isLinear = true;

  constructor(
    public dialogRef: MatDialogRef<BuyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    public web3: Web3Service,
    public referralService: ReferralService,
    private tradeLinkService: TradeLinkService,
    private notify: NotificationService
  ) {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.pattern(
        /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=.+$/
      ),],
    });

    this.item = data;

    const tradeLinkLS: string = this.tradeLinkService.getTradeLinkUrl();

    if (tradeLinkLS !== '') {
      this.firstFormGroup.controls['firstCtrl'].setValue(tradeLinkLS);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isBuyNowClicked: boolean = false;
  onBuyNowClick(): void {
    const isSellerAlsoBuyer = this.web3.webUser.address?.toLowerCase() === this.item.seller?.toLowerCase();

    if (isSellerAlsoBuyer) {
      this.notify.openSnackBar('You cannot buy your own item 😆', 'OK');
      return;
    }

    this.isBuyNowClicked = true;
  }

  onCheckOutClick(): void {
    const referralInfo = this.referralService.referralInfo;
    const netValues = this.web3.calculateNetValue(this.item.weiPrice, referralInfo.hasReferral, 2, referralInfo.discountRatio);
    const tradeLink = this.firstFormGroup.value.firstCtrl;

    this.tradeLinkService.setTradeLinkUrl(tradeLink);

    if (this.item.priceType === '0' && this.selectedEther === 'ETH') {
      this.web3.BuyItemWithEthToWeth(this.item.contractAddress, tradeLink, referralInfo.bytes32, netValues.buyerNetPrice).then((success: boolean) => {
        if (!success) {
          this.stepper!.selectedIndex = 0;
          return;
        }
        this.stepper!.selectedIndex = 2;
        this.notify.notify(`You're currently awaiting confirmation from seller for ${this.item.itemMarketName}.`, this.item.contractAddress, 'Cancel Trade', true);
      });
    } else {
      this.buyWithERC20(netValues.buyerNetPrice, tradeLink, referralInfo.bytes32, netValues.buyerNetPrice);
    }
  }

  selectedEther: string = 'ETH';
  onOptionSelected(event: any) {
    this.selectedEther = event.value;
    console.log(this.selectedEther);
  }

  allowanceLowerThanValue(allowanceString: string, valueString: string): boolean {
    const allowanceBN = new this.web3.csxInstance.window.web3.utils.BN(allowanceString);
    const valueBN = new this.web3.csxInstance.window.web3.utils.BN(valueString);

    return allowanceBN.lt(valueBN);
  }

  isApproving: boolean = false;
  buyWithERC20(_weiValue: string, _tradeLink: string, _rBytes32: string, _buyerNetVal: string) {
    const tokenValueInWeiString = _weiValue;

    const token = this.item.priceType === '0' ? 'WETH' : this.item.priceType === '1' ? 'USDC' : 'USDT';

    this.web3.allowance(token, this.web3.webUser.address!, this.item.contractAddress).then((allowance) => {
      console.log('allowance', allowance);
      console.log('tokenValue', tokenValueInWeiString);

      const allowanceBN = new this.web3.csxInstance.window.web3.utils.BN(allowance);
      const tokenValueInWeiBN = new this.web3.csxInstance.window.web3.utils.BN(tokenValueInWeiString);

      if (allowanceBN.lt(tokenValueInWeiBN)) {
        this.isApproving = true;
        this.web3.approve(token, this.item.contractAddress, tokenValueInWeiString).then(() => {
          this.isApproving = false;
          this._buyWithERC20(token, _weiValue, _tradeLink, _rBytes32, _buyerNetVal);
        }).catch((error) => {
          this.isApproving = false;
          this.stepper!.selectedIndex = 0;
          this.notify.openSnackBar(error.message, 'OK');
        });

      } else if (allowanceBN.gte(tokenValueInWeiBN)) {
        this._buyWithERC20(token, _weiValue, _tradeLink, _rBytes32, _buyerNetVal);
      }
    }).catch((error) => {
      this.notify.openSnackBar(error.message, 'OK');
    });
  }

  isBuying: boolean = false;
  _buyWithERC20(_token: string, _weiValue: string, _tradeLink: string, rBytes32: string, buyerNetVal: string) {
    this.isBuying = true;
    this.web3.BuyItem(this.item.contractAddress, _tradeLink, rBytes32, _weiValue).then((success: boolean) => {
      if (!success) {
        this.isBuying = false;
        this.stepper!.selectedIndex = 0;
        return;
      }
      this.isBuying = false;
      this.stepper!.selectedIndex = 2;
      console.log('buy item success');
      const _valueInEther = this.web3.csxInstance.window.web3.utils.fromWei(_weiValue, 'ether');
      this.web3.decreaseBalance(_token, _valueInEther);
    }
    ).catch((error) => {
      this.isBuying = false;
      this.notify.openSnackBar(error.message, 'OK');
      this.stepper!.selectedIndex = 0;
    });
  }
}
