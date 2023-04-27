import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-seller-cancelled-after-buyer-committed-dialog',
  templateUrl: './seller-cancelled-after-buyer-committed.dialog.html',
  styleUrls: ['./seller-cancelled-after-buyer-committed.dialog.scss'],
})
export class SellerCancelledAfterBuyerCommittedDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
