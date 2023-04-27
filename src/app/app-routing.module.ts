import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { EarnComponent } from './pages/earn/earn.component';
import { ReferralsComponent } from './pages/referrals/referrals.component';

const routes: Routes = [
  { path: '', component: MarketplaceComponent },
  { path: 'earn', component: EarnComponent },
  { path: 'referrals', component: ReferralsComponent },
  { path: '**', redirectTo: '' } // wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
