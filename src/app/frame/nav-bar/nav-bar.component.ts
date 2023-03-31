import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/shared/web3.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  // isWalletConnected = false;
  web3AccSub?: Subscription;
  notificationCountSub: Subscription;
  unreadNotifications: number = 0;
  account: any;
  trimmedAddress: any;
  constructor(public _web3: Web3Service, public notificationsService: NotificationService){
    this.web3AccSub = _web3.webUser.myAccount$?.subscribe(async (_account: any) => { this.account = _account; await this.runAfterWallet(); });
    this.notificationCountSub = notificationsService.newNotification$.subscribe((_noticeCount: any) => {
      this.unreadNotifications += _noticeCount;
    });
  }

  async ngOnInit(): Promise<void> {
  }

  async connectWallet(): Promise<void>{
    await this._web3.initWallet();
  }

  refresh(): void {
    window.location.reload();
  }

  isProcessing: boolean = false;
  firstTime: boolean = true;
  async runAfterWallet(){
    console.log("shorawda", this._web3.webUser.address);
    this.trimmedAddress = this.getTrimmedAccount();

    if(this.account){
      if(!this.firstTime){
        if(this.isProcessing == false){
          this.isProcessing = true;
          await this._web3.updateBalance();
          this.isProcessing = false;
        }
      } else {
        this.firstTime = false;
      }

    } else {
      // Couldnt connect popup.
    }
  }

  onNotiBellClick(){
    console.log("click");
    this.unreadNotifications = 0;
    console.log(this.unreadNotifications);
  }

  onIncorrectNetworkClick(){
    this._web3.requestUserSwitchToCorrectNetwork();
  }

  getTrimmedAccount(): string {
    return this._web3.getTrimmedAddress(this.account);
  }

  async ngOnDestroy(): Promise<void> {
    if(this.web3AccSub){
      this.web3AccSub.unsubscribe();
    }
    this.notificationCountSub.unsubscribe();
  }

}
