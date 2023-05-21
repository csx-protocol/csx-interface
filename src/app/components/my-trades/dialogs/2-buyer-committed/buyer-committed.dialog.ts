
import { ChangeDetectorRef, Component, Inject, Input, OnDestroy } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { BuyerCommittedService } from "./buyer-committed.service";
import { IntervalService } from "../interval.service";
import { NotificationService } from "../../../../shared/notification.service";
import { MyTradesService } from "../../my-trades.service";
import { TradeStatus } from "../../my-trades.component";
import { SubscriptionService } from "../subscription.service";

enum Role {
    Seller = "Seller",
    Buyer = "Buyer"
}

@Component({
    selector: 'trades-buyer-committed-dialog',
    templateUrl: './buyer-committed.dialog.html',
    styleUrls: ['./buyer-committed.dialog.scss'],
})
export class BuyerCommittedDialog implements OnDestroy {
    @Input() item: MyTradeItem | undefined;
    role: Role | undefined;
    isLoading: boolean = true;
    constructor(
        public committedService: BuyerCommittedService, 
        private intervalService: IntervalService, 
        private notificationService: NotificationService, 
        // private myTradesService: MyTradesService,
        private subscriptionService: SubscriptionService,
        ) { 
        this.isLoading = true;
    }

    // Listen on item changes
    ngOnChanges() {        
        this.isLoading = true;
        if (this.item) {
            this.role = this.item.uiInfo.role === "Seller" ? Role.Seller : Role.Buyer;
            this.validation();
            return;
        }
        this.isLoading = false;
    } 

    ngOnDestroy() {
        console.log("ngOnDestroy: ", this.item?.contractAddress);        
        //this.subscriptionService.unsubscribe(this.item?.contractAddress, 'BuyerCommittedDialog');
        this.subscriptionService.unsubscribeAllWithOrigin('BuyerCommittedDialog');
        if(this.item?.contractAddress)
        this.intervalService.stopInterval(this.item.contractAddress);
    }

    public getUIMode(_isLoading: boolean){
        // return 'query' or 'determinate'.
        return _isLoading ? 'query' : 'determinate';
    }

    // Set default to 30 minutes, you can change this to any value you want
    timeIntervalInMilliseconds: number = 24 * 60 * 60 * 1000;//5 * 60 * 1000; 
    //timeIntervalInMilliseconds: number = 24 * 60 * 60 * 1000; // 24 hours
    //timeIntervalInMilliseconds: number = 5 * 60 * 1000; // 5 minutes
    //timeIntervalInMilliseconds: number = 2 * 60 * 60 * 1000; // 2 hours
    //timeIntervalInMilliseconds: number = 60 * 60 * 1000; // 1 hour
    //timeIntervalInMilliseconds: number = 60 * 1000; // 1 minute    

    hasTimeIntervalPassed: boolean = false;
    buyerCommittTimestamp: number = 0;
    //hasStatusChanged: boolean = false;
    hasAccepted: boolean = false;
    private async validation() {
        if (this.item) {
          if (this.role === Role.Buyer) {
                console.log("Buyer");
                [this.hasTimeIntervalPassed, this.buyerCommittTimestamp] = await this._hasTimeIntervalPassedSinceBuyerCommittedToTrade();
                if (this.hasTimeIntervalPassed) {
                    // TODO: Show dialog to buyer that the time interval has passed
                    this.isLoading = false;
                } else {
                    const updateProgressBarAndTimeLeft = async () => {
                        this._updateProgressBarAndTimeLeft();
                    }
                    this.intervalService.createInterval(this.item.contractAddress, updateProgressBarAndTimeLeft);                    
                }
                
            } else {
                //console.log("Seller")
            }            
        }
    }

    /**
     * Buyer functions
     */

    private async _hasTimeIntervalPassedSinceBuyerCommittedToTrade(): Promise<[boolean, number]> {
        if (this.item) {
            const buyerCommitTimestamp = await this.committedService.getBuyerCommitTimestamp(this.item.contractAddress);
            const currentTime = new Date().getTime();
            const buyerCommitTimestampPlusTimeInterval = buyerCommitTimestamp + this.timeIntervalInMilliseconds;
            if (currentTime > buyerCommitTimestampPlusTimeInterval) {
                return [true, buyerCommitTimestamp];
            } else {
                return [false, buyerCommitTimestamp];
            }
        }
        return [false, 0];
    }

    progressBarValue: number = 0;
    private __getProgressBarValue(_buyerCommitTimestamp: any): number {
        if (this.item) {
            const buyerCommitTimestamp = _buyerCommitTimestamp;
            const currentTime = new Date().getTime();
            const buyerCommitTimestampMilliseconds = buyerCommitTimestamp * 1000; // Convert to milliseconds
            const buyerCommitTimestampPlusTimeInterval = buyerCommitTimestampMilliseconds + this.timeIntervalInMilliseconds;
            const timeDifference = currentTime - buyerCommitTimestampMilliseconds;
            const timeDifferencePercentage = timeDifference / (buyerCommitTimestampPlusTimeInterval - buyerCommitTimestampMilliseconds) * 100;
            const progressBarValue = Math.round(timeDifferencePercentage);

            if (progressBarValue > 100) {
                return 100;
            } else {
                return progressBarValue;
            }
        }
        return 0;
    }

    hours: number = 0;
    minutes: number = 0;
    seconds: number = 0;
    timeLeft: string = '??:??:??';
    private __calculateTimeLeft(_buyerCommitTimestamp: number) {
        const buyerCommitTimestamp = _buyerCommitTimestamp;
        const currentTime = new Date().getTime();
        const buyerCommitTimestampMilliseconds = buyerCommitTimestamp * 1000; // Convert to milliseconds
        const buyerCommitTimestampPlusTimeInterval = buyerCommitTimestampMilliseconds + this.timeIntervalInMilliseconds;
        const timeDifference = buyerCommitTimestampPlusTimeInterval - currentTime;
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.timeLeft = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    _updateProgressBarAndTimeLeft() {
        if (this.item && this.hasTimeIntervalPassed !== undefined) {
            this.progressBarValue = this.__getProgressBarValue(this.buyerCommittTimestamp);
            this.__calculateTimeLeft(this.buyerCommittTimestamp);
            console.log('this.progressBarValue', this.progressBarValue);

            if (this.progressBarValue === 100) {
                this.hasTimeIntervalPassed = true;
                this.intervalService.stopInterval(this.item.contractAddress);
                //this.chainEventsSubscription?.unsubscribe();             
            }
            this.isLoading = false;
        }
    }

    /**
     * Seller functions
     */

    isCancelling: boolean = false;
    // hasSuccessfullyCancelled: boolean = false;
    async cancelTrade() {
        if (this.item) {
            this.isCancelling = true;
            const isBuyer: boolean = this.role === Role.Buyer;
            await this.committedService.cancelTrade(this.item.contractAddress, isBuyer).then(() => {
                this.notificationService.openSnackBar('Trade Successfully Cancelled!', 'OK');
                // this.hasSuccessfullyCancelled = true;
                this.isCancelling = false;                
                //update my trades & map-ui + item if in map.
                const tradeStatus = isBuyer ? TradeStatus.BuyerCancelled : TradeStatus.SellerCancelled;
                //v---check if this is needed
                //this.myTradesService.updateTradeStatus(this.item!.contractAddress, tradeStatus);                
            }).catch((error) => {
                console.log(error);
                this.notificationService.openSnackBar(error.message, 'OK');
                this.isCancelling = false;
            });            
        }
    }

    isVeridicting: boolean = false;
    hasRejected: boolean = false;
    hasConfirmed: boolean = false;
    hasSuccessfullyVeridicted: boolean = false;
    async sellerTradeVeridict(isAccepting: boolean) {
        if (this.item) {
            this.isVeridicting = true;

            if(!isAccepting && !this.hasRejected){
                this.hasRejected = true;
                this.isVeridicting = false;
                return;
            } else {
                this.hasConfirmed = true;
            }

            await this.committedService.sellerTradeVeridict(this.item.contractAddress, isAccepting).then(() => {
                if(isAccepting){
                    this.notificationService.openSnackBar('Trade Successfully Accepted!', 'OK');
                    this.notificationService.notify(`You're about to deliver ${this.item?.itemMarketName}. It's time for you to deliver the trade`, this.item?.contractAddress, 'Confirm Trade', true)
                } else {
                    this.notificationService.openSnackBar('Trade Successfully Rejected!', 'OK');
                }                
                 this.hasSuccessfullyVeridicted = true;
                 this.hasRejected = false;
                 this.isVeridicting = false;
            }).catch((error) => {
                console.log(error);
                if(isAccepting){
                    this.notificationService.openSnackBar('Error Accepting Trade!', 'OK');
                } else {
                    this.notificationService.openSnackBar('Error Rejecting Trade!', 'OK');
                }
                this.isVeridicting = false;
                this.hasRejected = false;
            });
        }
    }
     
}
