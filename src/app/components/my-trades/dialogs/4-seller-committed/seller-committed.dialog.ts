import { Component, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-seller-committed-dialog',
  templateUrl: './seller-committed.dialog.html',
  styleUrls: ['./seller-committed.dialog.scss'],
})
export class SellerCommittedDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }

  confirmDelivery() {
    
  }
}
