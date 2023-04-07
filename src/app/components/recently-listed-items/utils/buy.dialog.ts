import { Component, Inject, Input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Item } from "../../../shared/item.interface";
import { Web3Service } from "src/app/shared/web3.service";

// export interface FloatValues {
//   min: number;
//   max: number;
//   float: number;
// }

@Component({
  selector: 'buy-dialog',
  templateUrl: './buy.dialog.html',
  styleUrls: ['./buy.dialog.scss'],
})
export class BuyDialog {

  avgDeliveryTime: string;
  isInMinutes: boolean = false;


  item: Item;


  firstFormGroup: FormBuilder | any;

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', /*Validators.required*/],
  });
  isLinear = true;

  constructor(
    public dialogRef: MatDialogRef<BuyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private web3: Web3Service
  ) {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.pattern(
        /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=.+$/
      ),],
    });

    this.item = data;

    const epochTime: number = parseInt(this.item.averageSellerDeliveryTime);

    //If average delivery time is less than 1 hour, display in minutes
    if (epochTime < 3600) {
      this.avgDeliveryTime = (epochTime / 60).toString();
      this.isInMinutes = true;
      return;
    }

    this.avgDeliveryTime = (epochTime / 60 / 60).toString();
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
    //this.web3.BuyItem(item.contractAddress, 'https://steamcommunity.com/tradeoffer/new/?partner=225482466&token=TESTTOKEN', item.weiPrice)"
  }

}
