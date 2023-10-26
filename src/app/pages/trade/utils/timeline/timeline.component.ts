// timeline.component.ts
import { AfterViewInit, Component, Input } from '@angular/core';
import { Web3Service } from '../../../../shared/web3.service';
import { TradeStatus } from '../../../../components/my-trades/my-trades.component';
import { TimelineService } from './timeline.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(620)
      ]),
      transition(':leave',
        animate(0, style({ opacity: 0 }))
      )
    ])
  ]
})
export class TimelineComponent implements AfterViewInit {
  @Input() contractAddress: string = '';
  @Input() weaponType: string = '';

  events: TimelineEvent[] = [
    { title: 'Item Listed', subTitle: 'For Sale', description: `<weapon_type> is for sale.`, status: TradeStatus.ForSale },
    { title: 'Item Delisted', subTitle: 'Seller Cancelled', description: 'Not for sale anymore.', status: TradeStatus.SellerCancelled },
    { title: 'Item Purchased', subTitle: 'Buyer Committed', description: 'A wild buyer appeared!', status: TradeStatus.BuyerCommitted },
    { title: `Buyer's Remorse`, subTitle: 'Buyer Cancelled', description: 'The buyer backed out.', status: TradeStatus.BuyerCancelled },
    { title: `Seller Accepted`, subTitle: 'Seller Committed', description: 'The seller has accepted.', status: TradeStatus.SellerCommitted },
    { title: `Seller Rejected`, subTitle: 'Seller Cancelled', description: 'The seller backed out.', status: TradeStatus.SellerCancelledAfterBuyerCommitted },
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
    this.events[0].description = `${this.weaponType} is for sale.`;
  
    this.web3.callContractMethod('Trade', 'getStatusCount', [this.contractAddress], 'call').then((count: number) => {
      const eventsLength: number = count;
  
      // Create a new array with the length of eventsLength + 1
      this.statusSkeleton = Array.from({ length: (eventsLength) }, (_, i) => i);
      this.statusSkeleton.push(0);
  
      const statusHistory: TimelineEvent[] = [];
      statusHistory.push(this.events[0]);
  
      const statusPromises: Promise<any>[] = [];
  
      for (let i = 0; i < eventsLength; i++) {
        const promise = this.web3.callContractMethod('Trade', 'statusHistory', [this.contractAddress, i], 'call').then((status: any) => {
          const event: TimelineEvent = this.events[status];
          statusHistory.push(event);
        });
        statusPromises.push(promise);
      }
  
      // Wait for all promises to resolve
      Promise.all(statusPromises).then(() => {
        // Sort statusHistory by status, lowest number first (ForSale = 0, SellerCancelled = 1, etc.)
        statusHistory.sort((a, b) => Number(a.status) - Number(b.status));
  
        this.statusHistory = statusHistory;
        this.isLoading = false;
      });
    });
  
    this.timelineService.status$.subscribe((status) => {
      if (status !== null) {
        this.addStatusHistory(status);
      }
    });
  }
  

  addStatusHistory(status: TradeStatus) {
    const event: TimelineEvent = this.events[status as number];
    if (this.statusHistory.find((e) => e.status == status)) {
      return;
    }    
    this.statusHistory.push(event);
  }

  getCardLineColor(status: TradeStatus): string {
    
    switch (status) {
      case TradeStatus.ForSale:
      case TradeStatus.BuyerCommitted:
      case TradeStatus.SellerCommitted:
      case TradeStatus.Completed:
      case TradeStatus.Resolved:
        return 'green';
      
      case TradeStatus.SellerCancelled:
      case TradeStatus.BuyerCancelled:
      case TradeStatus.SellerCancelledAfterBuyerCommitted:
      case TradeStatus.Clawbacked:
        return '#ba2431';
      
      case TradeStatus.Disputed:
        return 'rgb(172, 134, 0)';
      
      default:
        return 'grey';
    }
  }
  

}

export interface TimelineEvent {
  title: string;
  subTitle: string;
  description: string;
  image?: string;
  status: TradeStatus;
}