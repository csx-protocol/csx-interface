import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-resolved-dialog',
  templateUrl: './resolved.dialog.html',
  styleUrls: ['./resolved.dialog.scss'],
})
export class ResolvedDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
