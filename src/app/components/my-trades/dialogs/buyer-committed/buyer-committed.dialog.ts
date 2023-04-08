
import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";

@Component({
    selector: 'trades-buyer-committed-dialog',
    templateUrl: './buyer-committed.dialog.html',
    styleUrls: ['./buyer-committed.dialog.scss'],
})
export class BuyerCommittedDialog {
    @Input() item: MyTradeItem | undefined
    constructor() { }
}
