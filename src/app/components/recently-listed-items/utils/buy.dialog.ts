import { Component, Inject, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Item } from "../../../shared/item.interface";
import { Web3Service } from "../../../shared/web3.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ReferralService } from "../../../shared/referral.service";
import { TradeLinkService } from "../../../shared/trade-link-url.service";

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
    private web3: Web3Service,
    public referralService: ReferralService,
    private tradeLinkService: TradeLinkService
  ) {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.pattern(
        /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=.+$/
      ),],
    });

    this.item = data;

    const tradeLinkLS:string = this.tradeLinkService.getTradeLinkUrl();

    if(tradeLinkLS !== '') {
      this.firstFormGroup.controls['firstCtrl'].setValue(tradeLinkLS);
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isBuyNowClicked: boolean = false;
  onBuyNowClick(): void {
    this.isBuyNowClicked = true;
  }

  //isCheckOutClicked: boolean = false;
  onCheckOutClick(): void {
    //this.isCheckOutClicked = true;
    const referralInfo = this.referralService.referralInfo;
    const netValues = this.web3.calculateNetValue(this.item.weiPrice, referralInfo.hasReferral, 2, referralInfo.discountRatio);
    const tradeLink = this.firstFormGroup.value.firstCtrl;

    this.tradeLinkService.setTradeLinkUrl(tradeLink);

    console.log('netValues', netValues);
    
    this.web3.BuyItemWithEthToWeth(this.item.contractAddress, tradeLink, referralInfo.bytes32, netValues.buyerNetPrice).then((res) => {
      console.log(res);
      this.dialogRef.close(); // close the dialog
    }).catch((err) => {
      console.log(err);
    });

    
    // this.web3.BuyItem(this.item.contractAddress, this.firstFormGroup.value.firstCtrl, netValues.buyerNetPrice, referralInfo.bytes32).then((res) => {
    //   console.log(res);
    //   this.dialogRef.close(); // close the dialog 
    // }).catch((err) => {
    //   console.log(err);
    // });   
      
    
    //  this.web3.BuyItem(this.item.contractAddress, this.firstFormGroup.value.firstCtrl, this.item.weiPrice, referralInfo.bytes32)
    
    //this.web3.BuyItem(item.contractAddress, 'https://steamcommunity.com/tradeoffer/new/?partner=225482466&token=TESTTOKEN', item.weiPrice)"
  }

}
