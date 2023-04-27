import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-seller-cancelled-dialog',
  templateUrl: './seller-cancelled.dialog.html',
  styleUrls: ['./seller-cancelled.dialog.scss'],
})
export class SellerCancelledDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
