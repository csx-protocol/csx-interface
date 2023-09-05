import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { EarnComponent } from './pages/earn/earn.component';
import { ReferralsComponent } from './pages/referrals/referrals.component';
import { MintEscrowComponent } from './pages/mint-escrow/mint-escrow.component';
import { TradeComponent } from './pages/trade/trade.component';

const routes: Routes = [
  { path: '', component: MarketplaceComponent },
  { path: 'trade', component: TradeComponent },
  { path: 'trade/:optionalParam', component: TradeComponent },
  { path: 'earn', component: EarnComponent },
  { path: 'referrals', component: ReferralsComponent },
  { path: 'mint', component: MintEscrowComponent },
  { path: '**', redirectTo: '' } // wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
