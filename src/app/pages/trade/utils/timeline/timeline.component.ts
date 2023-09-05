// timeline.component.ts
import { AfterViewInit, Component, Input } from '@angular/core';
import { Web3Service } from '../../../../shared/web3.service';
import { TradeStatus } from '../../../../components/my-trades/my-trades.component';
import { TimelineService } from './timeline.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements AfterViewInit {
  @Input() contractAddress: string = '';

  events: TimelineEvent[] = [
    { title: 'Item Listed', subTitle: 'For Sale', description: 'AK-47 is for sale.', status: TradeStatus.ForSale },
    { title: 'Item Delisted', subTitle: 'Seller Cancelled', description: 'Not for sale anymore.', status: TradeStatus.SellerCancelled },
    { title: 'Item Purchased', subTitle: 'Buyer Committed', description: 'A wild buyer appeared!', status: TradeStatus.BuyerCommitted },
    { title: `Buyer's Remorse`, subTitle: 'Buyer Cancelled', description: 'The buyer backed out.', status: TradeStatus.BuyerCancelled },
    { title: `Seller Accepted`, subTitle: 'Seller Accepted', description: 'The seller has accepted.', status: TradeStatus.SellerCommitted },
    { title: `Seller Rejected`, subTitle: 'Seller Rejected', description: 'The seller backed out.', status: TradeStatus.SellerCancelledAfterBuyerCommitted },
    { title: `Item Sent`, subTitle: 'Completed', description: 'The trade has been completed.', status: TradeStatus.Completed },
    { title: `Trade Disputed`, subTitle: 'Disputed', description: 'Trade has been disputed.', status: TradeStatus.Disputed },
    { title: `Trade Resolved`, subTitle: 'Resolved', description: 'The trade has been resolveds.', status: TradeStatus.Resolved },
    { title: `Trade Clawbacked`, subTitle: 'Clawbacked', description: 'The trade has been clawbacked.', status: TradeStatus.Clawbacked }
  ];

  statusHistory: TimelineEvent[] = [];
  statusSkeleton: number[] = [];
  isLoading: boolean = true;
  constructor(private web3: Web3Service, private timelineService: TimelineService) { }

  ngAfterViewInit(): void {
    console.log(`contractAddress`, this.contractAddress);

    this.web3.callContractMethod('Trade', 'getStatusCount', [this.contractAddress], 'call').then((count: number) => {
      const eventsLength: number = count;

      //create a new array with the length of eventsLength + 1
      this.statusSkeleton = Array.from({ length: (eventsLength) }, (_, i) => i);
      this.statusSkeleton.push(0);

      const statusHistory: TimelineEvent[] = [];
      statusHistory.push(this.events[0]);

      for (let i = 0; i < eventsLength; i++) {
        const status = this.web3.callContractMethod('Trade', 'statusHistory', [this.contractAddress, i], 'call').then((status: any) => {
          //console.log(`status`, status);
          const event: TimelineEvent = this.events[status];
          statusHistory.push(event);
        });
      }
      this.statusHistory = statusHistory;

      this.isLoading = false;
    });

    this.timelineService.status$.subscribe((status) => {
      if (status !== null) {
        this.addStatusHistory(status);
      }
    });
  }

  addStatusHistory(status: TradeStatus) {
    const event: TimelineEvent = this.events[status as number];
    this.statusHistory.push(event);
  }


}

export interface TimelineEvent {
  title: string;
  subTitle: string;
  description: string;
  image?: string;
  status: TradeStatus;
}