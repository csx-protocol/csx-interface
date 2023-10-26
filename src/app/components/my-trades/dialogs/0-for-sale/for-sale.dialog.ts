import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "../../../../shared/web3.service";
import { ActionCardService } from "../../../../pages/trade/utils/action-card/action-card.service";
import { TradeStatus } from "../../my-trades.component";

@Component({
  selector: 'trades-for-sale-dialog',
  templateUrl: './for-sale.dialog.html',
  styleUrls: ['./for-sale.dialog.scss'],
})
export class ForSaleDialog {
  @Input() item: MyTradeItem | undefined;
  isCancelling = false;
  constructor(
    private readonly web3: Web3Service,
    private readonly actionCardService: ActionCardService) { }
  cancelTrade() {
    this.isCancelling = true;
    //console.log('this.item?.contractAddress', this.item?.contractAddress);
    
    this.web3.callContractMethod('Trade', 'sellerCancel', [this.item?.contractAddress], 'send').then((result) => {
      this.actionCardService.updateTradeStatus(TradeStatus.SellerCancelled);
      this.item!.status = TradeStatus.SellerCancelled as string;
      this.isCancelling = false;
    }).catch((error) => {
      console.log(error);
      this.isCancelling = false;
    });
  }
}
