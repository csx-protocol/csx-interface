import { Component, OnDestroy, } from '@angular/core';
import { Subscription } from 'rxjs';
import { Web3Service } from '../../shared/web3.service';
import { NotificationService } from '../../shared/notification.service';
import { MyTradeItem } from '../../components/my-trades/dialogs/my-trade-item.interface';
import { DialogComponent } from '../../components/my-trades/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IntervalService } from '../../components/my-trades/dialogs/interval.service';
import { TradeRole, TradeStatus } from '../../components/my-trades/my-trades.component';
import { wethConvertDialog } from './utils/wethConvert.dialog';
import { MyTradesService } from '../../components/my-trades/my-trades.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnDestroy {
  // isWalletConnected = false;
  autoLogin = new AutoLogin();
  web3AccSub?: Subscription;
  notificationCountSub: Subscription;
  unreadNotifications: number = 0;
  account: any;
  trimmedAddress: any;
  constructor(
    public _web3: Web3Service,
    public notificationsService: NotificationService,
    private dialog: MatDialog,
    private intervalService: IntervalService,
    private myTradesService: MyTradesService
  ) {
    this.autoLogin.isAutoLoginEnabled() ? this.connectWallet() : null;
    this.web3AccSub = _web3.webUser.myAccount$?.subscribe(async (_account: any) => { this.account = _account; await this.runAfterWallet(); });
    this.notificationCountSub = notificationsService.newNotification$.subscribe((_noticeCount: any) => {
      this.unreadNotifications += _noticeCount;
    });
  }

  loadingWallet: boolean = false;
  connectWallet(): void {
    this.autoLogin.enableAutoLogin();
    this.loadingWallet = true;
    this._web3.initWallet().then(async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      this.loadingWallet = false;
    }).catch((err) => {
      this.notificationsService.openSnackBar(err, 'OK');
      this.loadingWallet = false;
    });
  }

  disconnectWallet(): void {
    this.autoLogin.disableAutoLogin();
    this._web3.webUser.isUserWalletConnected = false;
  }

  refresh(): void {
    window.location.reload();
  }

  isProcessing: boolean = false;
  firstTime: boolean = true;
  async runAfterWallet() {
    console.log("Welcome", this._web3.webUser.address);
    this.trimmedAddress = this.getTrimmedAccount();

    if (this.account) {
      await this._web3.updateUser();
      this.myTradesService.initialized = false;
      this.myTradesService.init();
    } else {
      // Couldnt connect popup.
    }
  }

  onNotiBellClick() {
    console.log("click");
    this.unreadNotifications = 0;
    console.log(this.unreadNotifications);
  }

  onIncorrectNetworkClick() {
    this._web3.requestUserSwitchToCorrectNetwork();
  }

  getTrimmedAccount(): string {
    return this._web3.getTrimmedAddress(this.account);
  }

  uiItem: MyTradeItem = {
    contractAddress: '',
    seller: '',
    sellerTradeUrl: ['', ''],
    buyer: '',
    buyerTradeUrl: ['', ''],
    itemMarketName: '',
    inspectLink: '',
    itemImageUrl: '',
    weiPrice: '',
    averageSellerDeliveryTime: '',
    float: { max: 0, min: 0, value: 0 },
    status: '',
    stickers: [],
    weaponType: '',
    etherPrice: '',
    trimmedAddress: '',
    uiInfo: { contractAddress: '', role: '', status: '' },
    skinInfo: undefined,
    priceType: ''
  };

  async openDaDialog(_contractAddress: string): Promise<void> {

    let details = await this._web3.getTradeDetailsByAddress(
      _contractAddress
    );

    const role = this._web3.webUser.address?.toLowerCase() == details.buyer?.toLowerCase() ? TradeRole.BUYER : TradeRole.SELLER;
    const item = { contractAddress: _contractAddress, index: undefined, role: role, status: details.status };
    const [max, min, value] = this.getFloatValues(details.skinInfo);
    details = {
      ...details,
      uiInfo: {
        ...item,
        status: this.__getStatusString(item.status),
        role: this.__getRoleString(item.role),
      },
      float: { max: max, min: min, value: value }
    };

    this.uiItem = details;

    this._openDialog(this.uiItem);
  }

  getFloatValues(skinInfo: any) {
    const floatValues = skinInfo.floatValues;
    const floatValuesArray = JSON.parse(floatValues);
    return floatValuesArray;
  }

  private __getStatusString(status: TradeStatus | string): string {
    switch (status) {
      case '0' || TradeStatus.ForSale:
        return 'For Sale';
      case '1' || TradeStatus.SellerCancelled:
        return 'Seller Cancelled';
      case '2' || TradeStatus.BuyerCommitted:
        return 'Buyer Committed';
      case '3' || TradeStatus.BuyerCancelled:
        return 'Buyer Cancelled';
      case '4' || TradeStatus.SellerCommitted:
        return 'Seller Committed';
      case '5' || TradeStatus.SellerCancelledAfterBuyerCommitted:
        return 'Seller Cancelled After Buyer Committed';
      case '6' || TradeStatus.Completed:
        return 'Completed';
      case '7' || TradeStatus.Disputed:
        return 'Disputed';
      case '8' || TradeStatus.Resolved:
        return 'Resolved';
      case '9' || TradeStatus.Clawbacked:
        return 'Clawbacked';
      default:
        console.log('ERROR', status);
        return 'ERROR';
    }
  }

  private __getRoleString(role: TradeRole | string): string {
    console.log('GGGGGG', role);

    switch (role) {
      case 0:
        return 'Buyer';
      case 1:
        return 'Seller';
      default:
        return 'ERROR';
    }
  }

  private _openDialog(myTradeItem: MyTradeItem): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: myTradeItem
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.intervalService.stopAllIntervals();
    });
  }

  async ngOnDestroy(): Promise<void> {
    this.web3AccSub?.unsubscribe();
    this.notificationCountSub.unsubscribe();
  }

  addCommas(num: number | string): string {
    const [integerPart, decimalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  openSwapDialog(_data: any): void {
    const dialogRef = this.dialog.open(wethConvertDialog, {
      data: _data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }


}

export class AutoLogin {
  private readonly autoLoginKey = 'autoLoginEnabled';

  constructor() { }

  // Check if auto-login is enabled
  isAutoLoginEnabled(): boolean {
    const autoLoginState = localStorage.getItem(this.autoLoginKey);
    // If the key doesn't exist in localStorage, return false (or a default value of your choice)
    if (autoLoginState === null) {
      return false;
    }
    // If the key exists, compare its value to the string 'true'
    return autoLoginState === 'true';
  }

  // Enable auto-login
  enableAutoLogin(): void {
    localStorage.setItem(this.autoLoginKey, 'true');
  }

  // Disable auto-login
  disableAutoLogin(): void {
    localStorage.setItem(this.autoLoginKey, 'false');
  }

  // Toggle auto-login state
  toggleAutoLogin(): void {
    const currentState = this.isAutoLoginEnabled();
    localStorage.setItem(this.autoLoginKey, (!currentState).toString());
  }
}