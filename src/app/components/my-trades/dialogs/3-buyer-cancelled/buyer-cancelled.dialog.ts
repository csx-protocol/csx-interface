import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-buyer-cancelled-dialog',
  templateUrl: './buyer-cancelled.dialog.html',
  styleUrls: ['./buyer-cancelled.dialog.scss'],
})
export class BuyerCancelledDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
