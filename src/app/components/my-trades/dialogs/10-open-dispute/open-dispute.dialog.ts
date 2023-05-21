import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'trades-open-dispute-dialog',
  templateUrl: './open-dispute.dialog.html',
  styleUrls: ['./open-dispute.dialog.scss'],
  animations: [
    trigger('cardAnimation', [
        state('in', style({ opacity: 1, transform: 'scale(1)' })),
        transition('void => *', [
            style({ opacity: 0, transform: 'scale(0.5)' }),
            animate(150),
        ]),
        transition('* => void', [
            animate(150, style({ opacity: 0, transform: 'scale(0.5)' })),
        ]),
    ]),
],
})
export class OpenDisputeDialog {
  @Input() item: MyTradeItem | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
    this.item = this.data;
  }
}
