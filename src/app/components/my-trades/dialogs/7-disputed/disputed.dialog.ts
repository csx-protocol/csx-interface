import { AfterViewInit, Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { Web3Service } from "../../../../shared/web3.service";

@Component({
  selector: 'trades-disputed-dialog',
  templateUrl: './disputed.dialog.html',
  styleUrls: ['./disputed.dialog.scss'],
})
export class DisputedDialog implements AfterViewInit{
  @Input() item: MyTradeItem | undefined
  constructor(private _web3: Web3Service) {}

  isDisputeer: boolean = false;
  oppositeRole: string = '';
  disputeComplaint: string = '';
  async ngAfterViewInit(): Promise<void> {
    console.log('dialog item', this.item);
    this.isDisputeer = await this.getIsDisputeer();
    this.oppositeRole = this.item?.uiInfo.role === 'Buyer' ? 'Seller' : 'Buyer';
    this.disputeComplaint = await this.getDisputeComplaint();
  }

  async getIsDisputeer(): Promise<boolean> {
    // this.item?.uiInfo.role can either be 'Buyer' or 'Seller'.
    // event.returnValues.sellerAddress.toLowerCase() == this.webUser.address?.toLowerCase()
    return this._web3.callContractMethod('Trade', 'disputeer', [this.item!.contractAddress], 'call').then((result) => {

      const user = this._web3.webUser.address?.toLowerCase();
      const disputeer = result.toLowerCase();
  
      if(user === disputeer) {
        return true;
      }
      
      return false;
      
    }).catch((error) => {
      console.log('error', error);
      return false;
    });
  }
  
  async getDisputeComplaint(): Promise<string> {
    return this._web3.callContractMethod('Trade', 'disputeComplaint', [this.item!.contractAddress], 'call').then((result) => {
      return result;
    }).catch((error) => {
      console.log('error', error);
      return '';
    });
  }
}
