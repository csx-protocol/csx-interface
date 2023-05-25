import { AfterViewInit, Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "src/app/shared/web3.service";

@Component({
  selector: 'trades-completed-dialog',
  templateUrl: './completed.dialog.html',
  styleUrls: ['./completed.dialog.scss'],
})
export class CompletedDialog implements AfterViewInit {
  @Input() item: MyTradeItem | undefined
  constructor(private _web3: Web3Service) {}

  ngAfterViewInit() {
    this.hasMadeRepBefore();
  }

  isRepping: boolean = false;
  hasRepped: boolean = false;
  hasReppedBefore: boolean = false;
  labelChoice: string = '';
  repAfterTrade(_isPositive: boolean) {
    this.labelChoice = _isPositive ? '+REP' : '-REP';
    this.isRepping = true;
    this._web3.repAfterTrade(this.item!.contractAddress, _isPositive).then((result: any) => {
      console.log('result', result);
      this.isRepping = false;
      this.hasRepped = true;
    }
    ).catch((error: any) => {
      this.isRepping = false;
      console.log('error', error);
    });
  }

  hasMadeRepBefore() {
    this._web3.hasMadeRepOnTrade(this.item!.contractAddress).then((result: any) => {
      console.log('result', result);

      const role = this.item?.uiInfo.role; // 'Buyer' or 'Seller'
      const hasBuyer = result.hasBuyer; // true or false
      const hasSeller = result.hasSeller; // true or false

      const hasMadeRepBefore: boolean = role === 'Buyer' ? hasBuyer : hasSeller; 

      this.hasReppedBefore = hasMadeRepBefore;
    }
    ).catch((error: any) => {
      console.log('error', error);
    });
  }
}
