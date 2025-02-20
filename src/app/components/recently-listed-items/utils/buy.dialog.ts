import { Component, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Item } from "../../../shared/item.interface";
import { Web3Service } from "../../../shared/web3.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ReferralService } from "../../../shared/referral.service";
import { TradeLinkService } from "../../../shared/trade-link-url.service";
import { MatStepper } from "@angular/material/stepper";
import { NotificationService } from "../../../shared/notification.service";
import { MyTradesService } from "../../my-trades/my-trades.service";
import { TradeStatus } from "../../my-trades/my-trades.component";
import { ActionCardService } from "../../../pages/trade/utils/action-card/action-card.service";

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
  @Output() public dialogData: EventEmitter<any> = new EventEmitter();
  @ViewChild('stepper') stepper: MatStepper | undefined;
 // @ViewChild('stepper2') stepper2: MatStepper | undefined;
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
    private notify: NotificationService,
    private myTradesService: MyTradesService,
    private readonly actionCardService: ActionCardService
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

  partnerIdToSteamId64(partnerId: string): string {
    return (BigInt(partnerId) + BigInt(76561197960265728n)).toString();
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
    const netValues = this.web3.calculateNetValue(this.item.weiPrice, referralInfo.hasReferral, this.web3.webUser.baseFee, referralInfo.discountRatio);
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
        //this.myTradesService.updateTradeStatus(this.item.contractAddress, TradeStatus.BuyerCommitted);
        this.dialogData.emit({ bought: true });
        this.actionCardService.updateTradeStatus(TradeStatus.BuyerCommitted);
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
    const allowanceBN = this.web3.toBN(allowanceString);
    const valueBN = this.web3.toBN(valueString);

    return allowanceBN.lt(valueBN);
  }

  isApproving: boolean = false;
  hasEnoughBalanceERC20: boolean = false;
  async buyWithERC20(_weiValue: string, _tradeLink: string, _rBytes32: string, _buyerNetVal: string) {
    const tokenValueInWeiString = _weiValue;

    const token = this.item.priceType === '0' ? 'WETH' : this.item.priceType === '1' ? 'USDC' : 'USDT';   
    
    // check balance of user first
    //const balance = this.web3.getBalance(token);
    const balance = await this.web3.callContractMethod(token, 'balanceOf', [this.web3.webUser.address!], "call");
    const balanceBN = this.web3.toBN(balance);
    const tokenValueInWeiBN = this.web3.toBN(tokenValueInWeiString);

    // if balance is lower than value, then return
    if (balanceBN.lt(tokenValueInWeiBN)) {
      this.notify.openSnackBar(`You don't have enough ${token} to buy this item.`, 'OK');
      this.stepper!.selectedIndex = 0;
      return;
    }

    this.web3.allowance(token, this.web3.webUser.address!, this.item.contractAddress).then((allowance) => {
      console.log('allowance', allowance);
      console.log('tokenValue', tokenValueInWeiString);

      const allowanceBN = this.web3.toBN(allowance);
      const tokenValueInWeiBN = this.web3.toBN(tokenValueInWeiString);

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
      const _valueInEther = this.web3.csxInstance.web3.utils.fromWei(_weiValue, 'ether');
      this.web3.decreaseBalance(_token, _valueInEther);
      this.myTradesService.updateTradeStatus(this.item.contractAddress, TradeStatus.BuyerCommitted);
      this.dialogData.emit({ bought: true });
      this.actionCardService.updateTradeStatus(TradeStatus.BuyerCommitted);
    }
    ).catch((error) => {
      this.isBuying = false;
      this.notify.openSnackBar(error.message, 'OK');
      this.stepper!.selectedIndex = 0;
    });
  }
}
