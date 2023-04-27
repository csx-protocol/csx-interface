import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-for-sale-dialog',
  templateUrl: './for-sale.dialog.html',
  styleUrls: ['./for-sale.dialog.scss'],
})
export class ForSaleDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
