import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-clawbacked-dialog',
  templateUrl: './clawbacked.dialog.html',
  styleUrls: ['./clawbacked.dialog.scss'],
})
export class ClawbackedDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
