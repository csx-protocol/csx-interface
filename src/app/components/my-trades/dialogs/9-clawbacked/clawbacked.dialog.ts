import { AfterViewInit, Component, Inject, Input, OnDestroy } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "../../../../shared/web3.service";

@Component({
  selector: 'trades-clawbacked-dialog',
  templateUrl: './clawbacked.dialog.html',
  styleUrls: ['./clawbacked.dialog.scss'],
})
export class ClawbackedDialog implements OnDestroy, AfterViewInit {
  @Input() item: MyTradeItem | undefined;
  clawbackReason: string = '';
  constructor(private web3: Web3Service) { }

  ngAfterViewInit(): void {
    this.web3.callContractMethod('Trade', 'finalityResult', [this.item?.contractAddress], 'call').then((result: string) => {
      this.clawbackReason = result;
    });
  }

  ngOnDestroy(): void {
    // this.item?.trade?.contractAddress
  }
}
