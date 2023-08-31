import { Component } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss'],
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
