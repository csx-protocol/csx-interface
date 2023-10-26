import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, first, switchMap } from 'rxjs/operators';
import { ReferralService } from './shared/referral.service'; // Update the import path if necessary
import { RecentlyListedItemsService } from './components/recently-listed-items/recently-listed-items.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referralService: ReferralService,
    private recentListedItemsService: RecentlyListedItemsService,
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => event.urlAfterRedirects.startsWith('/?')),
        switchMap(() => this.route.root.firstChild!.queryParams),
      )
      .subscribe(() => {
        const root = this.route.root.firstChild;
        if (root) {
          root.queryParams.pipe(first()).subscribe((params) => {
            const refCode = params['r'];
            if (refCode) {
              if (this.referralService.hasLocalReferralCode()) {
                // Update referral code if it already exists
                this.referralService.updateLocalReferralCode(refCode);
              } else {
                // Store the referral code in localStorage
                this.referralService.setLocalReferralCode(refCode);
              }
            }
            const item = params['i'];
            if (item) {
              // Store the item id in localStorage
              this.recentListedItemsService.selectedName = item;
              if (this.recentListedItemsService.initialized) {
                this.recentListedItemsService.filterNames({ target: { value: item } }, false);
              }

            } else {
              if (this.recentListedItemsService.initialized) {          
                this.recentListedItemsService.selectedName = '';
                this.recentListedItemsService.filterNames({ target: { value: '' } }, false);
              }
            }
          });
        }
      });
  }
}
