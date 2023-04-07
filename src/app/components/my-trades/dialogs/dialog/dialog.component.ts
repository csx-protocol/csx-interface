import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyTradeItem } from '../my-trade-item.interface';
import { Web3Service } from 'src/app/shared/web3.service';
enum Role {
  BUYER = 'Buyer',
  SELLER = 'Seller',
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent {
  item: MyTradeItem;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private web3: Web3Service) {
    console.log('data', data);

    this.item = this.initDialog(data);
  }

  initDialog(_item: any) {
    return _item;
  }
}
