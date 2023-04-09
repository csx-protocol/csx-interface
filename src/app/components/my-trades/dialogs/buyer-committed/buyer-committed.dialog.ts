
import { Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { BuyerCommittedService } from "./buyer-committed.service";
import { IntervalService } from "../interval.service";

enum Role {
    Seller = "Seller",
    Buyer = "Buyer"
}

@Component({
    selector: 'trades-buyer-committed-dialog',
    templateUrl: './buyer-committed.dialog.html',
    styleUrls: ['./buyer-committed.dialog.scss'],
})
export class BuyerCommittedDialog {
    @Input() item: MyTradeItem | undefined;
    role: Role | undefined;
    isLoading: boolean = true;
    constructor(public committedService: BuyerCommittedService, private intervalService: IntervalService) {
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

    public getUIMode(_isLoading: boolean){
        // return 'query' or 'determinate'.
        return _isLoading ? 'query' : 'determinate';
    }

    // Set default to 30 minutes, you can change this to any value you want
    timeIntervalInMilliseconds: number = 2 * 60 * 60 * 1000;   
    //timeIntervalInMilliseconds: number = 2 * 60 * 60 * 1000; // 2 hours
    //timeIntervalInMilliseconds: number = 24 * 60 * 60 * 1000; // 24 hours
    //timeIntervalInMilliseconds: number = 60 * 60 * 1000; // 1 hour
    //timeIntervalInMilliseconds: number = 60 * 1000; // 1 minute

    hasTimeIntervalPassed: boolean = false;
    buyerCommittTimestamp: number = 0;
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
            //console.log('this.progressBarValue', this.progressBarValue);

            if (this.progressBarValue === 100) {
                this.hasTimeIntervalPassed = true;
                this.intervalService.stopInterval(this.item.contractAddress);                
            }
            this.isLoading = false;
        }
    }
}
