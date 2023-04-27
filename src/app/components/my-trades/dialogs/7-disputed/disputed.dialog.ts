import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
  selector: 'trades-disputed-dialog',
  templateUrl: './disputed.dialog.html',
  styleUrls: ['./disputed.dialog.scss'],
})
export class DisputedDialog {
  @Input() item: MyTradeItem | undefined
  constructor() { }
}
