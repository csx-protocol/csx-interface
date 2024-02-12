import { trigger, style, transition, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { ItemDetails } from '../../../../components/list-items/list-items.component';
import { Web3Service } from '../../../../shared/web3.service';

interface ItemDetailsForSignItems extends ItemDetails {
  isDone?: boolean;
  isConfirmed?: boolean;
}

export const THROW_OUT_DURATION_MS = 800;

export const throwOutAnimation = trigger('throwOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate(`${THROW_OUT_DURATION_MS}ms ease-out`, style({ 
      transform: 'translateX({{direction}}%) rotate({{rotation}}deg)', 
      opacity: 0 
    }))
  ]),
]);

@Component({
  selector: 'app-sign-items',
  templateUrl: './sign-items.component.html',
  styleUrls: ['./sign-items.component.scss'],
  animations: [
    throwOutAnimation
  ],
})
export class SignItemsComponent implements AfterViewInit {
  readonly _CARD_WIDTH: number = 240;
  containerWidth: number = 0;
  itemDetails: ItemDetailsForSignItems[] = [];
  constructor(
    private elRef: ElementRef,
    private readonly cdr: ChangeDetectorRef,
    private readonly web3: Web3Service,
  ) { }

  ngAfterViewInit() {
    this.getContainerWidth();
    this.cdr.detectChanges();
  }

  getContainerWidth() {
    // Calculate and set the container width
    const containerElement = this.elRef.nativeElement.querySelector('.card-container');
    if (containerElement) {
      this.containerWidth = containerElement.clientWidth;
    }
  }

  getCardLeftPosition(index: number): number {
    const offset = 20; // Your offset for each card
    const mobileBreakpoint = 600; // Adjust this breakpoint as needed

    // Calculate total width when cards are stacked
    const totalStackedWidth = this._CARD_WIDTH + (this.itemDetails.length - 1) * offset;

    let startPosition = ((this.containerWidth - totalStackedWidth) / 2);

    // For mobile screens, adjust if startPosition is negative
    if (window.innerWidth < mobileBreakpoint) {
      let maxAcceptable = (this.containerWidth / 2) * 2;
      console.log("maxAcceptable", -maxAcceptable);
      startPosition = Math.max(startPosition, -maxAcceptable);
    }

    // Calculate position for the current card
    return startPosition + index * offset;
  }

  hasLoadedItems = false;
  loadItems(_items: ItemDetails[]) {
    const _ITEMS_COPY = _items;
    this.itemDetails = _ITEMS_COPY as ItemDetailsForSignItems[];
    this.hasLoadedItems = true;
  }

  removingCardId: string | null = null;
  removeCard(_isConfirmed: boolean) {
    console.log("Removing card with isConfirmed = ", _isConfirmed);

    if (this.itemDetails.length > 0) {
      const removingCard = this.itemDetails[0]; // Assuming you're removing the first card
      this.removingCardId = removingCard.assetId; // Track the ID of the card being removed
      removingCard.isConfirmed = _isConfirmed; // Set the isConfirmed flag to trigger the animation
      removingCard.isDone = true; // Set the isDone flag to trigger the animation
      
      // Try to list item via metamask,
      // if user accepts, set isConfirmed to true
      // if user accepts, dont wait for the confirmation, just remove the card
      // if failed, set isConfirmed to false
      // if rejected by user, set isConfirmed to false

      // Reset removingCardId after animation duration
      setTimeout(() => {
        this.itemDetails.shift();
        this.getContainerWidth();
        this.removingCardId = null;
      }, 0); // Next tick after pre animation state is set (isConfirmed = true)
    }
  }

  /**
   * this.web3.listItem(
        this.itemData.full_item_name, 
        tradeLink, 
        this.tempAssetId, 
        itemInspectLink, 
        this.exactImage, 
        weiPrice, 
        this.float_val.toString(), 
        this.minFloat.toString(), 
        this.maxFloat.toString(), 
        this.itemData.paintseed, 
        this.itemData.paintindex, 
        _stickers, 
        weaponType, 
        priceType
        ).then((res: any) => {
        //console.log("res", res);
        //this.notiServ.openSnackBar('Item listed successfully!', 'gg, okay🤦');
        this.loadingMetaMask = false;
        this.successMetaMask = true;
        const contractAddress = res.events.TradeContractStatusChange.returnValues.contractAddress;
        this.listedContractAddress = contractAddress;  
      }).catch((err: any) => {
        console.log("err", err);
        this.notiServ.openSnackBar(err, 'gg, okay🤦');
        this.loadingMetaMask = false;
        this.stepper!.selectedIndex = 1;
      });
   */
}

export const listingParams = {
  itemMarketName: "itemMarketName",
  tradeUrl: {
    partner: '225482466',
    token: 'EP2Wgs2R'
  },
  assetId: "assetId",
  inspectLink: "inspectLink",
  itemImageUrl: "itemImageUrl",
  weiPrice: "1000000000000000000",
  skinInfo: [
    '[0.8, 0.06, 0.35223010182380676]',
    '8',
    '27'
  ],
  stickers: [{
    name: 'Sticker',
    material: 'sticker/sticker',
    slot: 0,
    imageLink: 'imageLink'
  }],
  weaponType: "weaponType",
  priceType: "0"
};

export interface ListingParams {
  itemMarketName: string;
  tradeUrl: {
    partner: string;
    token: string;
  };
  assetId: string;
  inspectLink: string;
  itemImageUrl: string;
  weiPrice: string;
  skinInfo: SkinInfo;
  stickers: Array<{
    name: string;
    material: string;
    slot: number;
    imageLink: string;
  }>;
  weaponType: string;
  priceType: string;
}

export interface SkinInfo {
  floatValues: string;
  paintSeed: string;
  paintIndex: string;
}
