import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnDestroy } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "../../../../shared/web3.service";
import { MatDialog } from "@angular/material/dialog";
import { OpenDisputeDialog } from "../10-open-dispute/open-dispute.dialog";
import { TradeStatus } from "../../my-trades.component";
import { ActionCardService } from "../../../../pages/trade/utils/action-card/action-card.service";
import { Subscription, interval, startWith, takeWhile } from "rxjs";
import { NotificationService } from "../../../../shared/notification.service";

@Component({
  selector: 'trades-seller-committed-dialog',
  templateUrl: './seller-committed.dialog.html',
  styleUrls: ['./seller-committed.dialog.scss'],
})
export class SellerCommittedDialog implements AfterViewInit, OnDestroy {
  @Input() item: MyTradeItem | undefined;
  constructor(
    private web3: Web3Service,
    private dialog: MatDialog,
    private readonly actionCardService: ActionCardService,
    private readonly notify: NotificationService,
    private readonly zone: NgZone,
    private readonly cdRef: ChangeDetectorRef
    ) { }

  ngAfterViewInit(): void {
    console.log('dialog item', this.item, this.dialog);
    this.startProgress();
  }

  isConfirming: boolean = false;
  hasConfirmedDelivery: boolean = false;
  hasOpenDispute: boolean = false;
  confirmDelivery() {
    this.isConfirming = true;
    this.web3.buyerConfirmReceived(this.item!.contractAddress).then((result) => {
      console.log('result', result);
      this.isConfirming = false;
      this.hasConfirmedDelivery = true;
      this.item!.status = TradeStatus.Completed as string;
      this.actionCardService.updateTradeStatus(TradeStatus.Completed);
    }
    ).catch((error) => {
      console.log('error', error);
      this.isConfirming = false;
    });
  }

  openDispute(myTradeItem: MyTradeItem): void {
    const dialogRef = this.dialog.open(OpenDisputeDialog, {
      data: myTradeItem
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result == 'success') {
        this.item!.status = TradeStatus.Disputed as string;
      }
    });
  }

  isDisputingTL: boolean = false;
  isDisputingWrongInventory: boolean = false;

  openDisputeWithCause(myTradeItem: MyTradeItem, cause: string): void {
    if (cause == 'BUYER_INVALID_TRADELINK') {
      this.isDisputingTL = true;
    }
    if (cause == 'SELLER_SENT_WRONG_INVENTORY') {
      this.isDisputingWrongInventory = true;
    }
    this.web3.callContractMethod('Trade', 'openDispute', [myTradeItem!.contractAddress, cause], 'send').then((result) => {
      console.log('result', result)
      this.isDisputingTL = false;
      this.isDisputingWrongInventory = false;
      this.item!.status = TradeStatus.Disputed as string;
      this.actionCardService.updateTradeStatus(TradeStatus.Disputed);
    }
    ).catch((error) => {
      console.log('error', error);
      this.isDisputingTL = false;
      this.isDisputingWrongInventory = false;
    });
  }

  getSteamId64(_partnerId: string): string {
    const partnerId = _partnerId;
    if (partnerId) {
      const partnerIdInt = parseInt(partnerId);
      return `https://steamcommunity.com/profiles/7656119${partnerIdInt + 7960265728}`;
    }
    return 'ERROR';
  }

  getTradeOfferLink(): string {
    const partnerId = this.item?.buyerTradeUrl[0];
    const token = this.item?.buyerTradeUrl[1];
    return `https://steamcommunity.com/tradeoffer/new/?partner=${partnerId}&token=${token}`;
  }

  progressValue: number = 0;
  timeLeft: number = 60;
  private progressSubscription?: Subscription;
  refreshStatus(verbose?: boolean) {
    this.web3.callContractMethod('Trade', 'status', [this.item!.contractAddress], 'call').then((result) => {
      if(this.item!.status != result){
        this.item!.status = result;
        this.actionCardService.updateTradeStatus(result);
      } else {
        if(verbose) {
          this.notify.openSnackBar('Status not updated yet.', 'OK')
        }
        this.progressSubscription?.unsubscribe();
        this.progressValue = 0;
        this.timeLeft = 60;
        this.startProgress();
      }
    }).catch((error) => {
      console.log('error', error);
    });
  }

  // startProgress() {
  //   const oneMinute = 60; // 60 seconds
  //   const intervalPeriod = 1000; // Update every second
  //   this.timeLeft = oneMinute;

  //   this.progressSubscription = interval(intervalPeriod).pipe(
  //     startWith(0), // Emit the first value immediately
  //     takeWhile(() => this.timeLeft > 0) // Stop when timeLeft is 0
  //   ).subscribe({
  //     next: () => {
  //       this.timeLeft -= 1; // Decrement time left by one second
  //       this.progressValue = ((oneMinute - this.timeLeft) / oneMinute) * 100; // Convert to percentage
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     },
  //     complete: () => {
  //       // Complete callback is called when timeLeft is 0
  //       this.progressValue = 100; // Fill the progress bar when time is up
  //       // Call any additional logic you want when the timer completes
  //       this.refreshStatus(); // Call a method to refresh the status
  //       setTimeout(() => this.startProgress(), 1000); // Wait for 1 second before restarting
  //     }
  //   });
  // }

  startProgress() {
    const oneMinute = 60; // 60 seconds
    const intervalPeriod = 1000; // Update every second
  
    this.progressSubscription = interval(intervalPeriod).pipe(
      startWith(0), // Emit the first value immediately
      takeWhile(() => this.timeLeft > 0) // Stop when timeLeft is 0
    ).subscribe({
      next: () => {
        this.zone.run(() => { // Ensure update is within Angular's zone
          this.timeLeft -= 1; // Decrement time left by one second
          this.progressValue = ((oneMinute - this.timeLeft) / oneMinute) * 100; // Convert to percentage
          this.cdRef.detectChanges(); // Manually trigger change detection
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.zone.run(() => { // Ensure update is within Angular's zone
          this.progressValue = 100; // Fill the progress bar when time is up
          this.refreshStatus(); // Call a method to refresh the status
          //setTimeout(() => this.startProgress(), 1000); // Wait for 1 second before restarting
        });
      }
    });
  }
  
  ngOnDestroy() {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }
}
