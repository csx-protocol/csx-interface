import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  CdkVirtualScrollViewport,
  CdkVirtualForOf,
  ScrollingModule,
} from '@angular/cdk/scrolling';

//jdenticon
import { NgxJdenticonModule } from 'ngx-jdenticon';

/**
 * Angular Material Modules
 */
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';
import {ClipboardModule} from '@angular/cdk/clipboard';

/**
 * Custom Modules
 */
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgCircleProgressModule } from 'ng-circle-progress';

/**
 * Components
 */
import { FooterComponent } from './frame/footer/footer.component';
import { NavBarComponent } from './frame/nav-bar/nav-bar.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RecentlyListedItemsComponent } from './components/recently-listed-items/recently-listed-items.component';
import { FloatBarComponent } from './components/float-bar/float-bar.component';
import { BuyDialog } from './components/recently-listed-items/utils/buy.dialog';
import { MyTradesComponent } from './components/my-trades/my-trades.component';
import { SellerCommittedDialog } from './components/my-trades/dialogs/4-seller-committed/seller-committed.dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogComponent } from './components/my-trades/dialog/dialog.component';
import { ForSaleDialog } from './components/my-trades/dialogs/0-for-sale/for-sale.dialog';
import { BuyerCommittedDialog } from './components/my-trades/dialogs/2-buyer-committed/buyer-committed.dialog';
import { SellerCancelledDialog } from './components/my-trades/dialogs/1-seller-cancelled/seller-cancelled.dialog';
import { BuyerCancelledDialog } from './components/my-trades/dialogs/3-buyer-cancelled/buyer-cancelled.dialog';
import { SellerCancelledAfterBuyerCommittedDialog } from './components/my-trades/dialogs/5-seller-cancelled-after-buyer-committed/seller-cancelled-after-buyer-committed.dialog';
import { CompletedDialog } from './components/my-trades/dialogs/6-completed/completed.dialog';
import { DisputedDialog } from './components/my-trades/dialogs/7-disputed/disputed.dialog';
import { ResolvedDialog } from './components/my-trades/dialogs/8-resovled/resolved.dialog';
import { ClawbackedDialog } from './components/my-trades/dialogs/9-clawbacked/clawbacked.dialog';
import { LevelCircleComponent } from './components/level-circle/level-circle.component';
import { CustomTooltipDirective } from './shared/custom-tooltip.directive';
import { LevelUpDialog } from './components/level-circle/utils/level-up.dialog';
import {MatSliderModule} from '@angular/material/slider';
import { EarnComponent } from './pages/earn/earn.component';
import { ReferralsComponent } from './pages/referrals/referrals.component';
import { StakeDialog } from './pages/earn/utils/stake.dialog';
import { AffiliateComponent } from './pages/referrals/affiliate/affiliate.component';
import { MyCodeComponent } from './pages/referrals/my-code/my-code.component';
import { wethConvertDialog } from './frame/nav-bar/utils/wethConvert.dialog';
import { OpenDisputeDialog } from './components/my-trades/dialogs/10-open-dispute/open-dispute.dialog';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavBarComponent,
    MarketplaceComponent,
    ListItemComponent,
    RecentlyListedItemsComponent,
    FloatBarComponent,
    //Make own modules later
    BuyDialog, // recently listed items comp
    MyTradesComponent, // my trades comp
    DialogComponent, // my trades comp
    ForSaleDialog, // my trades comp
    SellerCancelledDialog, // my trades comp
    BuyerCommittedDialog, // my trades comp
    BuyerCancelledDialog, // my trades comp
    SellerCommittedDialog, // my trades comp
    SellerCancelledAfterBuyerCommittedDialog, // my trades comp
    CompletedDialog, // my trades comp
    DisputedDialog, // my trades comp
    ResolvedDialog, // my trades comp
    ClawbackedDialog, LevelCircleComponent, // my trades comp
    CustomTooltipDirective, // LevelCircleComponent & my trades comp & recently listed items comp
    LevelUpDialog, EarnComponent, ReferralsComponent, // LevelCircleComponent
    StakeDialog, AffiliateComponent, MyCodeComponent, // EarnComponent
    wethConvertDialog, // NavBarComponent
    OpenDisputeDialog // SellerCommittedDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxJdenticonModule,
    FormsModule,
    FlexLayoutModule,
    ClipboardModule,
    //Custom Modules
    NgxSkeletonLoaderModule,
    NgCircleProgressModule.forRoot({
      // radius: 100,
      // outerStrokeWidth: 16,
      // innerStrokeWidth: 8,
      // outerStrokeColor: "#78C000",
      // innerStrokeColor: "#C7E596",
      // animationDuration: 300,
    }),
    //Angular Material Modules
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    MatBadgeModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    ScrollingModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSortModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTableModule
  ],
  exports: [CdkVirtualScrollViewport, CdkVirtualForOf],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
