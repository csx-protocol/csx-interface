import { Component, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "../../../../shared/web3.service";
import { MatDialog } from "@angular/material/dialog";
import { OpenDisputeDialog } from "../10-open-dispute/open-dispute.dialog";

@Component({
  selector: 'trades-seller-committed-dialog',
  templateUrl: './seller-committed.dialog.html',
  styleUrls: ['./seller-committed.dialog.scss'],
})
export class SellerCommittedDialog {
  @Input() item: MyTradeItem | undefined;
  constructor(private web3: Web3Service, private dialog: MatDialog) { }

  isConfirming: boolean = false;
  hasConfirmedDelivery: boolean = false;
  hasOpenDispute: boolean = false;
  confirmDelivery() {
    this.isConfirming = true;
    this.web3.buyerConfirmReceived(this.item!.contractAddress).then((result) => {
      console.log('result', result);
      this.isConfirming = false;
      this.hasConfirmedDelivery = true;
    }
    ).catch((error) => {
      console.log('error', error);
      this.isConfirming = false;
    });
  }

  openDispute(myTradeItem: MyTradeItem): void {
    const dialogRef = this.dialog.open(OpenDisputeDialog, {
      data: myTradeItem
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
