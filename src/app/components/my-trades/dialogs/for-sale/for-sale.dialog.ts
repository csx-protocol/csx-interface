import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'trades-for-sale-dialog',
  templateUrl: './for-sale.dialog.html',
  styleUrls: ['./for-sale.dialog.scss'],
})
export class ForSaleDialog {
  constructor(
    public dialogRef: MatDialogRef<ForSaleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
