import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyTradeItem } from '../dialogs/my-trade-item.interface';
import { Web3Service } from '../../../shared/web3.service';
import { TradeRole, TradeStatus } from '../my-trades.component';
import { SubscriptionService } from '../dialogs/subscription.service';
import { NotificationService } from '../../../shared/notification.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnDestroy {
  item: MyTradeItem;
  //localStatus: string = 'undefined'; // 

  ngOnDestroy(): void {
    // console.log("Destroying event", this.item.contractAddress);
    this.subscriptionService.unsubscribeAllWithOrigin(this.item.contractAddress);
  }

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _web3: Web3Service,
    private subscriptionService:
      SubscriptionService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    // console.log('data', data);
    this.item = this.initDialog(data);

    //console.log('item', this.item);
    
    //const status = this.item.status;
    //this.localStatus = status;
    // console.log('status', this.item.status);

    // console.log("Starting event", this.item.contractAddress);
    
    this.subscriptionService.addSubscription([this.item.contractAddress], (event) => {
      // Handle the event
      console.log('Event received', event);

      const status = event[1];

      if (status == TradeStatus.SellerCancelledAfterBuyerCommitted) {

        if(this.item.uiInfo.role == 'Seller'){
          this.notificationService.openSnackBar("Trade has been successfully rejected.", "OK");
        }

        if(this.item.uiInfo.role == 'Buyer'){
          this.notificationService.openSnackBar("Seller has rejected your trade", "OK");
        }
        

      } 
      
      if (status == TradeStatus.SellerCommitted) {
        if(this.item.uiInfo.role == 'Seller'){
          this.notificationService.openSnackBar("Trade has been successfully accepted.", "OK");
        }

        if(this.item.uiInfo.role == 'Buyer'){
          this.notificationService.openSnackBar("Seller has accepted your trade", "OK");
        }
      }

      if(status == TradeStatus.BuyerCancelled) {
        if(this.item.uiInfo.role == 'Seller'){
          this.notificationService.openSnackBar("Buyer has cancelled the trade", "OK");
        }

        if(this.item.uiInfo.role == 'Buyer'){
          this.notificationService.openSnackBar("Trade has been successfully cancelled.", "OK");
        }
      }
      this.newItem(this.item.contractAddress);
      this.cdr.detectChanges();
      
    }, 'DialogComponent');
  }

  async newItem(_contractAddress: string) {
    let details = await this._web3.getTradeDetailsByAddress(
      _contractAddress
    );

    // console.log('CHECK YO DETAILS');
    // console.log('webuser', this._web3.webUser.address);
    // console.log('buyer', details.buyer);
    // console.log('IR: seller', details.seller);

    const role = this._web3.webUser.address?.toLowerCase() == details.buyer.toLowerCase() ? TradeRole.BUYER : TradeRole.SELLER;
    const item = {contractAddress: _contractAddress, index: undefined, role: role, status: details.status};
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

    this.item = details;
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
    //console.log('Role', role);
    
    switch (role) {
      case 0:
        return 'Buyer';
      case '0':
        return 'Buyer';
      case 1:
        return 'Seller';
      case '1':
        return 'Seller';
      default:
        return 'ERROR';
    }
  }

  initDialog(_item: any) {
    return _item;
  }
}
