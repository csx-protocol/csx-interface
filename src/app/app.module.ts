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

/**
 * Custom Modules
 */
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

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
import { SellerCommittedDialog } from './components/my-trades/dialogs/seller-committed/seller-committed.dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogComponent } from './components/my-trades/dialogs/dialog/dialog.component';
import { ForSaleDialog } from './components/my-trades/dialogs/for-sale/for-sale.dialog';


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
    BuyDialog,
    SellerCommittedDialog,
    ForSaleDialog,
    MyTradesComponent,
    DialogComponent // recently listed item comp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxJdenticonModule,
    FormsModule,
    FlexLayoutModule,
    //Custom Modules
    NgxSkeletonLoaderModule,
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
    MatSortModule
  ],
  exports: [CdkVirtualScrollViewport, CdkVirtualForOf],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
