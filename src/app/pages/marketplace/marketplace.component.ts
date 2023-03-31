import { Component } from '@angular/core';
import { CsgoItemsService } from 'src/app/shared/csgo-items.service';
import { Web3Service } from 'src/app/shared/web3.service';
import { MarketplaceService } from './marketplace.service';
export interface ExampleTab {
  label: string;
  content: string;
}
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
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
