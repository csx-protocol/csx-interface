import { AfterViewInit, Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "../../../../shared/web3.service";
import { ActionCardService } from "../../../../pages/trade/utils/action-card/action-card.service";
import { TradeStatus } from "../../my-trades.component";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";
import { NotificationService } from "../../../../shared/notification.service";

@Component({
  selector: 'trades-for-sale-dialog',
  templateUrl: './for-sale.dialog.html',
  styleUrls: ['./for-sale.dialog.scss'],
})
export class ForSaleDialog implements AfterViewInit {
  @Input() item: MyTradeItem | undefined;
  choice: "no_choice" | "cancel" | "change_price" = "no_choice";
  selectedPriceType: "ETH" | "USDC" | "USDT" = "ETH";
  isCancelling = false;
  isChangingPrice = false;
  changePriceBuilder: FormBuilder | any;
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private readonly web3: Web3Service,
    private readonly actionCardService: ActionCardService,
    private _formBuilder: FormBuilder,
    private readonly notifServ: NotificationService) {
    this.changePriceBuilder = this._formBuilder.group({
      priceControl: [
        '',
        [
          Validators.required,
          this._positiveNumberValidator,
          this._validNumberValidator,
        ],
      ],
    });
  }

  ngAfterViewInit(): void {
    this.selectedPriceType = this.item?.priceType === "0" ? "ETH" : this.item?.priceType === "1" ? "USDC" : "USDT";
  }

  step: 0.025 | 1 = 0.025;
  itemF: any;
  changeChoice(choice: "no_choice" | "cancel" | "change_price") {
    this.choice = choice;
    if (choice === "change_price") {
      let item = this.item as any;
      let etherPrice;
      // if indexinfo doesnt exists, create it
      if (item.indexInfo?.etherPrice === undefined) {        
        etherPrice = item.etherPrice;
        item.indexInfo = { etherPrice: item.etherPrice };
      } else {
        etherPrice = item.indexInfo.etherPrice;
      }
      this.itemF = item;
      this.changePriceBuilder.get('priceControl').setValue(etherPrice);
      this.step = this.selectedPriceType === "ETH" ? 0.025 : 1;
    }
  }

  cancelTrade() {
    this.isCancelling = true;
    //console.log('this.item?.contractAddress', this.item?.contractAddress);
    
    this.web3.callContractMethod('Trade', 'sellerCancel', [this.item?.contractAddress], 'send').then((result) => {
      this.actionCardService.updateTradeStatus(TradeStatus.SellerCancelled);
      this.item!.status = TradeStatus.SellerCancelled as string;
      this.isCancelling = false;
    }).catch((error) => {
      console.log(error);
      this.isCancelling = false;
    });
  }

  attemptChangePrice() {
    // check if form is valid
    if (this.changePriceBuilder.invalid) {
      return;
    }
    console.log('this.changePriceBuilder.value.priceControl', this.changePriceBuilder.value.priceControl);
    // convert to wei / 10^18 (18 decimals) or 10^6 (6 decimals) depending on price type selected (ETH, USDC, USDT) using this.web3.toWei(ethVal: string, unit: any | undefined)
    console.log('this.selectedPriceType', this.selectedPriceType);
    let weiPrice = this.web3.toWei(this.changePriceBuilder.value.priceControl, this.selectedPriceType === "ETH" ? 'ether' : 'mwei');
    this.changePrice(weiPrice);
    console.log('weiPrice', weiPrice);
  }

  changePrice(newWeiPrice: string) {
    this.isChangingPrice = true;
    this.web3.callContractMethod('Trade', 'changePrice', [this.item?.contractAddress, newWeiPrice], 'send').then((result) => {
      this.item!.weiPrice = newWeiPrice;
      this.item!.etherPrice = this.web3.fromWei(newWeiPrice, this.selectedPriceType === "ETH" ? 'ether' : 'mwei');
      this.notifServ.openSnackBar("Price has been successfully changed.", "OK");
      this.isChangingPrice = false;
      this.dialogRef.close();
    }).catch((error) => {
      console.log(error);
      this.isChangingPrice = false;
    });
  }

  private _positiveNumberValidator(
    control: FormControl
  ): { [s: string]: boolean } | null {
    if (control.value <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  _validNumberValidator(control: FormControl): { [s: string]: boolean } | null {
    if (isNaN(control.value)) {
      return { validNumber: true };
    }
    return null;
  }
}
