import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MyTradesService } from './my-trades.service';
import { DialogComponent } from './dialog/dialog.component';
import { MyTradeItem } from './dialogs/my-trade-item.interface';
import { IntervalService } from './dialogs/interval.service';

// Role of the trade
export enum TradeRole {
  BUYER,
  SELLER,
  ANY = 'ANY'
}

export enum TradeStatus {
  ForSale,
  SellerCancelled,
  BuyerCommitted,
  BuyerCancelled,
  SellerCommitted,
  SellerCancelledAfterBuyerCommitted,
  Completed,
  Disputed,
  Resolved,
  Clawbacked,
  ANY = 'ANY'
}

export interface UserInteraction {
  contractAddress: string;
  role: TradeRole;
  status: TradeStatus;
  statusString: string;
}

@Component({
  selector: 'app-my-trades',
  templateUrl: './my-trades.component.html',
  styleUrls: ['./my-trades.component.scss'],
})
export class MyTradesComponent {

  sortedData: UserInteraction[];

  constructor(public myTradesService: MyTradesService, private dialog: MatDialog, private intervalService: IntervalService) {
    this.sortedData = this.myTradesService.userItems.slice();
  }

  sortData(sort: Sort) {
    const data = this.myTradesService.userItems.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.myTradesService.userItems = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'itemMarketName':
          return compare(a.itemMarketName, b.itemMarketName, isAsc);
        case 'tradeRole':
          return compare(a.uiInfo.role, b.uiInfo.role, isAsc);
        case 'tradeStatus':
          return compare(a.uiInfo.status, b.uiInfo.status, isAsc);
        case 'etherPrice':
          return compare(a.etherPrice, b.etherPrice, isAsc);
        default:
          return 0;
      }
    });
  }

  openDialog(myTradeItem: MyTradeItem): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: myTradeItem
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.intervalService.stopAllIntervals();
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
