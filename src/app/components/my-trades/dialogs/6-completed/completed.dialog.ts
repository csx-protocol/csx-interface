import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-completed-dialog',
  templateUrl: './completed.dialog.html',
  styleUrls: ['./completed.dialog.scss'],
})
export class CompletedDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
