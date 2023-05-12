import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { ReferralService } from './shared/referral.service'; // Update the import path if necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private referralService: ReferralService
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const root = this.route.root.firstChild;
        if (root) {
          root.queryParams.pipe(first()).subscribe((params) => {
            const code = params['r'];
            if (code) {
              if (this.referralService.hasLocalReferralCode()) {
                // Update referral code if it already exists
                this.referralService.updateLocalReferralCode(code);
              } else {
                // Store the referral code in localStorage
                this.referralService.setLocalReferralCode(code);
              }
            }
          });
        }
      });
  }
}
