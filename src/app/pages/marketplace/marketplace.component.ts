import { Component } from '@angular/core';
import { CsgoItemsService } from 'src/app/shared/csgo-items.service';
import { Web3Service } from 'src/app/shared/web3.service';
import { MarketplaceService } from './marketplace.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface ExampleTab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(620)
      ]),
      transition(':leave',
        animate(620, style({ opacity: 0 }))
      )
    ])
  ]
})
export class MarketplaceComponent {
  panelOpenState = false;

  constructor(
    public web3: Web3Service,
    public csgoItems: CsgoItemsService,
    public marketplaceService: MarketplaceService
  ) {}

  dealingsInit: boolean = false;
  onDealingsOpen() {
    if (!this.dealingsInit) {
      this.dealingsInit = true;
      this.hasInitTradesClick = true;
      this.csgoItems.fetchItems();
    }
  }

  hasInitTradesClick: boolean = false;
  onTabChange(event: any) {
    // if(event.tab.textLabel == 'My Trades')
    // if (!this.hasInitTradesClick) {
    //   this.hasInitTradesClick = true;
    // }
  }
}
