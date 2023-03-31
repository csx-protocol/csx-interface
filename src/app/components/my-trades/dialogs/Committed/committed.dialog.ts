import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'trades-committed-dialog',
  templateUrl: './committed.dialog.html',
  styleUrls: ['./committed.dialog.scss'],
})
export class CommittedDialog {
  constructor(
    public dialogRef: MatDialogRef<CommittedDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
