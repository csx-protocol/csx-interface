import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface FloatValues {
  min: number;
  max: number;
  float: number;
}

@Component({
  selector: 'buy-dialog',
  templateUrl: './buy.dialog.html',
  styleUrls: ['./buy.dialog.scss'],
})
export class BuyDialog {
  name: string;
  price: string;
  sellerAddy: string;
  avgDeliveryTime: string;
  isInMinutes: boolean = false;
  floats: FloatValues = {
    min: 0,
    max: 0,
    float: 0,
  };
  imageLink: string;
  constructor(
    public dialogRef: MatDialogRef<BuyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.name = this.data.name;
    this.price = this.data.price;
    this.sellerAddy = this.data.sellerAddy;
    const epochTime = this.data.avgDeliveryTime;
    this.floats = this.data.floats;
    this.imageLink = this.data.imageLink;

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

  // setName() {
  //   this.data.name = this.name;
  // }
}
