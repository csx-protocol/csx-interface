import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TradeItem, TradeRole, TradeStatus } from '../../trade.component';
import { Web3Service } from '../../../../shared/web3.service';
import { MyTradeItem } from '../../../../components/my-trades/dialogs/my-trade-item.interface';
import { DialogComponent } from '../../../../components/my-trades/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IntervalService } from '../../../../components/my-trades/dialogs/interval.service';
import { ActionCardService } from './action-card.service';
import { BuyDialog } from '../../../../components/recently-listed-items/utils/buy.dialog';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent implements OnChanges {
  @Input() item: TradeItem | undefined;
  @Input() role: TradeRole | undefined;
  @Input() status: TradeStatus | undefined;

  constructor(
    private readonly web3: Web3Service, 
    private dialog: MatDialog, 
    private intervalService: IntervalService,
    private readonly actionCardService: ActionCardService
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      //console.log('ActionCardComponent ngOnChanges item', this.item);
      //..
    }
    if (changes['role']) {
      //console.log('ActionCardComponent ngOnChanges role', this.role);
      //..
    }
    if (changes['status']) {
      //console.log('ActionCardComponent ngOnChanges status', this.status);
      //..
    }
  }

  openDialog(myTradeItem: MyTradeItem): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: myTradeItem
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      console.log(`Dialog result: ${result}`);
      this.intervalService.stopAllIntervals();
      const newStatus = await this.getNewStatus();
      if(newStatus !== this.status) {
        this.actionCardService.updateTradeStatus(newStatus);
      }
    });
  }

  openBuyDialog(_item: TradeItem): void {
    let dialogRef = this.dialog.open(BuyDialog, {
      data: _item,
    });

    //this.timelineService.addStatus(TradeStatus.BuyerCommitted);

    // dialogRef.componentInstance.dialogData.subscribe((data: any) => {
    //   console.log(`data`, data);
    //   if (data.bought) {
    //     // this.timelineService.addStatus(TradeStatus.BuyerCommitted);
    //     // this.status = TradeStatus.BuyerCommitted;
    //     // this.firstFormGroup.get('firstCtrl')!.setValue('valid');
    //     // this.stepper!.selectedIndex = 1;
    //   }
    // });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result`, result);
    });
  }

  async getNewStatus(): Promise<TradeStatus> {
    return this.web3.callContractMethod('Trade', 'status', [this.item?.contractAddress], 'call').then((result) => {
      return result as TradeStatus;
    });
  }

  convertTradeItemToMyTradeItem(_item: TradeItem): MyTradeItem {
    const role = this.role;
    const item = { contractAddress: _item.contractAddress, index: undefined, role: role, status: _item.status };

    const [max, min, value] = _item.skinInfo.floatValues;

    const details = {
      ..._item,
      uiInfo: {
        ...item,
        status: this.statusToString(item.status as TradeStatus),
        role: this.__getRoleString(item.role as TradeRole),
      },
      float: { max: max, min: min, value: value }
    } as unknown as MyTradeItem;

    return details;
  }

  public statusToString(_status: TradeStatus): string {
    const statusMap: { [key in TradeStatus]: string } = {
      [TradeStatus.ForSale]: 'For Sale',
      [TradeStatus.SellerCancelled]: 'Seller Cancelled',
      [TradeStatus.BuyerCommitted]: 'Buyer Committed, the seller has not yet accepted the trade.',
      [TradeStatus.BuyerCancelled]: 'Buyer Cancelled',
      [TradeStatus.SellerCommitted]: 'Seller Committed, awaiting item delivery.',
      [TradeStatus.SellerCancelledAfterBuyerCommitted]: 'Seller rejected the trade.',
      [TradeStatus.Completed]: 'Completed',
      [TradeStatus.Disputed]: 'Disputed',
      [TradeStatus.Resolved]: 'Resolved',
      [TradeStatus.Clawbacked]: 'Clawbacked',
      [TradeStatus.ANY]: ''
    };

    return statusMap[_status] ?? 'Unknown';
  }

  private __getRoleString(role: TradeRole | string): string {
    switch (role.toString()) {
      case '0':
        return 'Buyer' || TradeRole.BUYER;
      case '1':
        return 'Seller' || TradeRole.SELLER;
      default:
        return 'ERROR';
    }
  }

}
