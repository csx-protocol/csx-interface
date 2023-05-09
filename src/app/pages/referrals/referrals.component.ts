import { Component } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent {
  constructor(public web3: Web3Service) {
  }

  hasClickedAffiliateTab: boolean = false;
  onTabChange(event: any) {
    if (event.tab.textLabel == 'Affiliate') {
      if (!this.hasClickedAffiliateTab) {
        this.hasClickedAffiliateTab = true;
      }
    }
  }

}
