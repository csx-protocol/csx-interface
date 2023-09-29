import { Injectable, OnDestroy } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { TradeRole, TradeStatus, UserInteraction } from './my-trades.component';
import { SubscriptionService } from './dialogs/subscription.service';

export interface FilterType<T> {
  filter: T;
}

// function isTradeRole(value: any): value is TradeRole {
//   return Object.values(TradeRole).includes(value);
// }

// function isTradeStatus(value: any): value is TradeStatus {
//   return Object.values(TradeStatus).includes(value);
// }

@Injectable({
  providedIn: 'root',
})
export class MyTradesService implements OnDestroy{
  initialized: boolean = false;
  autoScroll: boolean = false;
  step: number = 5;
  isLoading: boolean = true;
  totalUserTrades: number = 0;
  userUIs: UserInteraction[] = [];
  userItems: any[] = [];
  filterToData = new Map<string, FilterItemsAndUIs>();
  hasMoreItemsToLoad: boolean = false;
  //^pendings: any;

  selectedRoleFilter: TradeRole = TradeRole.ANY;
  selectedStatusFilter: any = 'ANY';

  constructor(public web3: Web3Service, private subscriptionService: SubscriptionService) {
    console.log('MyTradesService constructor, initialized?', this.initialized);
    //this.init();
  }

  ngOnDestroy(): void {
    console.log('MyTradesService ngOnDestroy');    
    this.subscriptionService.unsubscribeAllWithOrigin('MyTradesService');
  }

  hasItems: boolean = false;
  async init() {
    if (!this.initialized) {
      this.initialized = true;
      this.totalUserTrades = await this._getTradesTotal();
      this.userUIs = await this._getTradeUIs(this.totalUserTrades);    
      
      // if this.userUIs is empty
      if (this.userUIs.length == 0) {
        this.isLoading = false;
        this.hasItems = false;
        return;
      }

      this.hasItems = true;

      if (this.totalUserTrades > 0) {
        this.filterToData.set('ANY', {
          UIs: this.userUIs,
          items: [],
        });

        console.log('this.userUIs', this.userUIs);

        const seller = this.userUIs.filter((ui) => ui.role == TradeRole.SELLER);
        this.filterToData.set('SELLER', {
          UIs: seller,
          items: [],
        });

        const buyer = this.userUIs.filter((ui) => ui.role == TradeRole.BUYER);
        this.filterToData.set('BUYER', {
          UIs: buyer,
          items: [],
        });

        const forSale = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.ForSale
        );
        this.filterToData.set('FOR_SALE', {
          UIs: forSale,
          items: [],
        });

        const sellerCancelled = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.SellerCancelled
        );
        this.filterToData.set('SELLER_CANCELLED', {
          UIs: sellerCancelled,
          items: [],
        });

        const buyerCommitted = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.BuyerCommitted
        );
        this.filterToData.set('BUYER_COMMITTED', {
          UIs: buyerCommitted,
          items: [],
        });

        const buyerCancelled = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.BuyerCancelled
        );
        this.filterToData.set('BUYER_CANCELLED', {
          UIs: buyerCancelled,
          items: [],
        });

        const sellerCommitted = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.SellerCommitted
        );
        this.filterToData.set('SELLER_COMMITTED', {
          UIs: sellerCommitted,
          items: [],
        });

        const sellerCancelledAfterBuyerCommitted = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.SellerCancelledAfterBuyerCommitted
        );
        this.filterToData.set('SELLER_CANCELLED_AFTER_BUYER_COMMITTED', {
          UIs: sellerCancelledAfterBuyerCommitted,
          items: [],
        });

        const completed = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Completed
        );
        this.filterToData.set('COMPLETED', {
          UIs: completed,
          items: [],
        });

        const disputed = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Disputed
        );
        this.filterToData.set('DISPUTED', {
          UIs: disputed,
          items: [],
        });

        const resolved = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Resolved
        );
        this.filterToData.set('RESOLVED', {
          UIs: resolved,
          items: [],
        });

        const clawbacked = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Clawbacked
        );
        this.filterToData.set('CLAWBACKED', {
          UIs: clawbacked,
          items: [],
        });

        // All Statues that are 'on-going'.
        const groupOnGoing = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.ForSale || ui.status == TradeStatus.BuyerCommitted || ui.status == TradeStatus.SellerCommitted || ui.status == TradeStatus.Disputed
        );
        this.filterToData.set('groupOnGoing', {
          UIs: groupOnGoing,
          items: [],
        });

        // All Statues that has 'ended'.
        const groupEnded = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.SellerCancelled || ui.status == TradeStatus.BuyerCancelled || ui.status == TradeStatus.SellerCancelledAfterBuyerCommitted || ui.status == TradeStatus.Completed || ui.status == TradeStatus.Resolved || ui.status == TradeStatus.Clawbacked
        );
        this.filterToData.set('groupEnded', {
          UIs: groupEnded,
          items: [],
        });

      }
      console.log('userUIs', this.userUIs);
      this.userItems = await this._loadFirstStep('ANY');
      console.log('userItems', this.userItems);
      this.isLoading = false;
      // this.hasMoreItemsToLoad =
      //   this.hasMoreItemsToLoad && this.userItems.length < this.totalUserTrades;

      // Status Stream
      const allContractAddresses: string[] = this.userUIs.map((ui) => ui.contractAddress);
      this.initStatusStream(allContractAddresses);
    }     
  }

  initStatusStream(contractAddresses: string[]) {
    this.subscriptionService.addSubscription(contractAddresses, (event) => {
      console.log('Updating Trade Status');
      
      this.updateTradeStatus(event.contractAddress, event[1]);
      
      console.log('event: ', event);

     //make another stream without addressScope and if user address is invovled, then update status
     // if status is 'BuyerCommitted', then data is:
     // data:"225482466+EP2Wgs2R||225482466+TESTTOKEN||0x4a2282ccf3ccfc727e961adef83299649ebefd7e||297776550000000000"
    //  const buyerAddress = event[1] == TradeStatus.BuyerCommitted ? event[2].split('||')[2] : null;
    //  console.log('buyerAddress: ', buyerAddress);
     
    }, 'MyTradesService');
  }



  updateTradeStatus(contractAddress: string, status: TradeStatus): boolean {
    const tradeUI = this.userUIs.find((ui) => ui.contractAddress == contractAddress);
    if (tradeUI) {
      tradeUI.status = status;
      // this.userItems = this.userItems.filter((item) => item.contractAddress != contractAddress);
      for (const [key, value] of this.filterToData.entries()) {
        console.log("Key: ", key);
        console.log("Value: ", value);
        // if contract address found, change status
        const uiIndex = value.UIs.findIndex((ui) => ui.contractAddress == contractAddress);
        if (uiIndex > -1) {
          value.UIs[uiIndex].status = status;          
        }

        const itemsIndex = value.items.findIndex((ui) => ui.contractAddress == contractAddress);
        if (itemsIndex > -1) {
          value.items[itemsIndex].status = status;          
          value.items[itemsIndex].uiInfo.status = this.__getStatusString(status.toString());
        }

        // if status is 'ended', remove from 'on-going' group
        if (status == TradeStatus.SellerCancelled || status == TradeStatus.BuyerCancelled || status == TradeStatus.SellerCancelledAfterBuyerCommitted || status == TradeStatus.Completed || status == TradeStatus.Resolved || status == TradeStatus.Clawbacked) {
          const uiIndex = this.filterToData.get('groupOnGoing')?.UIs.findIndex((ui) => ui.contractAddress == contractAddress);
          if (uiIndex !== undefined && uiIndex > -1) {           
            this.filterToData.get('groupOnGoing')?.UIs.splice(uiIndex, 1);
          }

          const itemsIndex = this.filterToData.get('groupOnGoing')?.items.findIndex((ui) => ui.contractAddress == contractAddress);
          if (itemsIndex !== undefined && itemsIndex > -1) {
            this.filterToData.get('groupOnGoing')?.items.splice(itemsIndex, 1);
          }          
        }
        // if status is 'on-going', remove from 'ended' group
        if (status == TradeStatus.ForSale || status == TradeStatus.BuyerCommitted || status == TradeStatus.SellerCommitted || status == TradeStatus.Disputed) {
          const uiIndex = this.filterToData.get('groupEnded')?.UIs.findIndex((ui) => ui.contractAddress == contractAddress);
          if (uiIndex !== undefined && uiIndex > -1) {
            this.filterToData.get('groupEnded')?.UIs.splice(uiIndex, 1);
          }

          const itemsIndex = this.filterToData.get('groupEnded')?.items.findIndex((ui) => ui.contractAddress == contractAddress);
          if (itemsIndex !== undefined && itemsIndex > -1) {            
            this.filterToData.get('groupEnded')?.items.splice(itemsIndex, 1);
          }
        }
      }

      //update this.userItems if contract address found, change status.
      const index = this.userItems.findIndex((ui) => ui.contractAddress == contractAddress);
      if (index > -1) {
        this.userItems[index].status = status;
        this.userItems[index].uiInfo.status = this.__getStatusString(status.toString());        
      }

      //if selectedStatusFilter is not Any or Appropiate (and condition to ended and on-going), remove from this.userItems.
      const isOnGoing = status == TradeStatus.ForSale || status == TradeStatus.BuyerCommitted || status == TradeStatus.SellerCommitted || status == TradeStatus.Disputed;
      const isEnded = status == TradeStatus.SellerCancelled || status == TradeStatus.BuyerCancelled || status == TradeStatus.SellerCancelledAfterBuyerCommitted || status == TradeStatus.Completed || status == TradeStatus.Resolved || status == TradeStatus.Clawbacked;
      if (this.selectedStatusFilter !== 'ANY' && this.selectedStatusFilter !== status) {
        if (this.selectedStatusFilter == 'groupOnGoing' && !isOnGoing) {
          this.userItems = this.userItems.filter((item) => item.contractAddress != contractAddress);
        }
        if (this.selectedStatusFilter == 'groupEnded' && !isEnded) {
          this.userItems = this.userItems.filter((item) => item.contractAddress != contractAddress);
        }
      }
      
      return true;
    }
    return false;
  }

  async onRoleFilterChange(event: any) {
    this.isLoading = true;
    console.log('MY-TRADES: onRoleFilterChange', event);
    const _selectedRoleFilter = event.value;
    this.selectedRoleFilter = _selectedRoleFilter;
    let _filteredItems = [];
    console.log('MY-TRADES: _selectedRoleFilter', _selectedRoleFilter);
    if (_selectedRoleFilter !== undefined) {
      _filteredItems = await this._loadFirstStep(_selectedRoleFilter);
      console.log('MY-TRADES: _filteredItems', _filteredItems);
    } else {
      this.selectedRoleFilter = TradeRole.ANY;
      _filteredItems = await this._loadFirstStep(TradeRole.ANY);
    }

    this.userItems = _filteredItems;
    this.hasMoreItemsToLoad =
      this.hasMoreItemsToLoad && this.userItems.length < this.totalUserTrades;

    this.isLoading = false;
  }

  isOnGoingSelected: boolean = false;
  isEndedSelected: boolean = false;
  async onStatusFilterChange(event: any) {
    this.isLoading = true;
    //this.isLoadingChip = true;
    const selectedFilter = event.value;
    this.selectedStatusFilter = selectedFilter;
    if (this.selectedStatusFilter == 'groupOnGoing') {
      this.isOnGoingSelected = true;
    } else {
      this.isOnGoingSelected = false;
    }
    if (this.selectedStatusFilter == 'groupEnded') {
      this.isEndedSelected = true;
    } else {
      this.isEndedSelected = false;
    }

    // Update filtered items based on selected filter
    let _filteredItems = [];
    let _filteredLength: number = 0;
    if (selectedFilter !== undefined) {
      console.log(
        'selectedRoleFilter',
        this.selectedRoleFilter,
        'selectedStatusFilter',
        selectedFilter,
        this.filterToData.get(this.selectedStatusFilter)?.UIs
      );
    }
    if (selectedFilter !== undefined) {
      _filteredItems = await this._loadFirstStep(selectedFilter);
      _filteredLength = _filteredItems.length;
    } else {
      _filteredItems = await this._loadFirstStep(TradeRole.ANY);
      _filteredLength = _filteredItems.length;
    }

    //IsMoreToLoad based on the total number of items available for the current filter vs what have been shown (not using this.totalUserTrades)
    this.hasMoreItemsToLoad =
      this.hasMoreItemsToLoad && _filteredLength < this.totalUserTrades;

    this.userItems = _filteredItems;
  }

  async onStatusFilterChange2(event: any) {
    this.isLoading = true;
    console.log('MY-TRADES: onStatusFilterChange', event);
    const _selectedStatusFilter = event.value;
    let _filteredItems = [];
    console.log('MY-TRADES: _selecteSdtatusFilter', _selectedStatusFilter);
    if (_selectedStatusFilter !== undefined) {
      _filteredItems = await this._loadFirstStep(_selectedStatusFilter);
      console.log('MY-TRADES: _filteredItems', _filteredItems);
    } else {
      _filteredItems = await this._loadFirstStep(TradeRole.ANY);
    }
    this.userItems = _filteredItems;
    // Set hasMoreItemsToLoad based on the total number of items available for the current filter
    this.hasMoreItemsToLoad =
      this.hasMoreItemsToLoad && this.userItems.length < this.totalUserTrades;
  }


  async _loadFirstStep(selectedFilter: TradeRole | TradeStatus | string) {
    this.isLoading = true;
    let _filteredItems = [];
    //Check if selectedFilter is typeof string or TradeRole or TradeStatus
    if (typeof selectedFilter === 'string') {
      console.log('MY-TRADES: selectedFilter is string');

      //
      // Check if selected filter is a key in the map and filter is string
      const hasKey = this.filterToData.has(selectedFilter as string);
      if (hasKey) {
        //this.userUIs = this.filterToData.get(selectedFilter.filter as string)!.UIs;
        const filteredObject = this.filterToData.get(selectedFilter as string);
        //console.log('filteredObject', filteredObject);

        if (
          filteredObject &&
          filteredObject?.items &&
          filteredObject?.items.length !== 0
        ) {
          if (!Array.isArray(filteredObject.items)) {
            _filteredItems = [filteredObject.items];
          } else {
            _filteredItems = filteredObject.items;
          }
        } else
          if (filteredObject && filteredObject?.UIs) {
            //console.log('MY-TRADES: Dont have items in map');
            //console.log('this.filterToData', this.filterToData);

            for (const item of filteredObject.UIs) {
              if (_filteredItems.length >= this.step) {
                break;
              }
              let details = await this.web3.getTradeDetailsByAddress(
                item.contractAddress
              );
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

              _filteredItems.push(details);
            }
            console.log('MY-TRADES: selectedFilter', selectedFilter);

            this.filterToData.set(selectedFilter as string, {
              items: _filteredItems,
              UIs: filteredObject.UIs,
            });
          }
        if (filteredObject)
          this.hasMoreItemsToLoad =
            _filteredItems.length < filteredObject.UIs.length;
      } else {
        console.log('MY-TRADES: selectedFilter is not a key in the map');
      }
    }
    this.isLoading = false;
    return _filteredItems;
  }

  async loadNextStep() {
    this.isLoading = true;
    let _filteredItems = [];
    const selectedRoleFilter = this.selectedRoleFilter;
    const selectedStatusGroupTypeFilter = undefined; // this.selectedStatusGroupTypeFilter;
    let selectedFilter;
    if (selectedStatusGroupTypeFilter !== undefined) {
      selectedFilter = selectedRoleFilter + selectedStatusGroupTypeFilter;
    }
    // else if (this.selectedName !== '') { // For filtering by name search bar.
    //   selectedFilter = this.selectedName;
    // }
    else {
      selectedFilter = selectedRoleFilter;
    }

    // Check if the filter is in the filterToData map
    const hasKey = this.filterToData.has(selectedFilter as string);
    if (!hasKey) {
      // If the filter doesn't exist, call _loadFirstStep() to get it
      await this._loadFirstStep(selectedFilter);
    }

    // Get the filter from the filterToData map
    const filteredObject = this.filterToData.get(selectedFilter as string);
    const filteredIndexes = filteredObject?.UIs;
    let filteredItems = filteredObject?.items;
    //^const? -v
    // if (this.filteredNames) {
    //   filteredItems = filteredItems.filter((item) =>
    //     this.filteredNames.includes(item.indexInfo.itemMarketName)
    //   );
    // }

    if (
      filteredIndexes &&
      filteredItems &&
      filteredIndexes.length > filteredItems.length
    ) {
      const startIndex = filteredItems.length;
      const endIndex = Math.min(filteredIndexes.length, startIndex + this.step);

      for (let i = startIndex; i < endIndex; i++) {
        const item = filteredIndexes[i];
        let details = await this.web3.getTradeDetailsByAddress(
          item.contractAddress
        );
        const [max, min, value] = this.getFloatValues(details.skinInfo);
        details = {
          ...details,
          uiInfo: {
            ...item,
            status: this.__getStatusString(item.status as string),
            role: this.__getRoleString(item.role as string),
          },
          float: { max: max, min: min, value: value }
        };

        _filteredItems.push(details);
      }
      console.log('SETTING: selectedFilter', selectedFilter);

      this.filterToData.set(selectedFilter as string, {
        items: [...filteredItems, ..._filteredItems],
        UIs: filteredIndexes,
      });

      this.userItems = [...filteredItems, ..._filteredItems];

      // Update hasMoreItemsToLoad based on the total number of items available for that filter
      const totalItems = filteredObject.UIs.length;
      this.hasMoreItemsToLoad = this.userItems.length < totalItems;

      if (!this.hasMoreItemsToLoad) {
        this.autoScroll = false;
      }
    }
    console.log('this.userItems', this.userItems);

    this.isLoading = false;
  }

  // async loadNextStep() {
  //   this.isLoading = true;
  //   let _filteredItems = [];
  //   const _selectedRoleFilter = this.selectedRoleFilter;
  //   if (_selectedRoleFilter !== undefined) {
  //     _filteredItems = await this._loadNextStep(_selectedRoleFilter);
  //   } else {
  //     _filteredItems = await this._loadNextStep(TradeRole.ANY);
  //   }
  //   this.userItems = _filteredItems;
  //   this.hasMoreItemsToLoad =
  //     this.hasMoreItemsToLoad && this.userItems.length < this.totalUserTrades;
  //   this.isLoading = false;
  // }

  async _loadNextStep(selectedFilter: TradeRole | TradeStatus | string) {
    this.isLoading = true;

    this.isLoading = false;
    return [];
  }

  private async _getTradesTotal() {
    return this.web3.callContractMethod('Users', 'getUserTotalTradeUIs', [this.web3.webUser.address], 'call');
  }

  private async _getTradeUIs(_total: number) {
    let trades = [];

    for (let i = 0; i < _total; i++) {
      trades.push(
        {
          ...await this.web3.callContractMethod('Users', 'getUserTradeUIByIndex', [this.web3.webUser.address, i], 'call'), 
          index : i
        });
    }

    return trades;
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
    switch (role) {
      case '0':
        return 'Buyer' || TradeRole.BUYER;
      case '1':
        return 'Seller' || TradeRole.SELLER;
      default:
        return 'ERROR';
    }
  }

  // cancelTrade(contractAddress: string, isBuyer: boolean) {
  //   this.web3.cancelTrade(contractAddress, isBuyer);
  // }

  getFloatValues(skinInfo: any) {
    const floatValues = skinInfo.floatValues;
    const floatValuesArray = JSON.parse(floatValues);
    return floatValuesArray;
  }
}

const filteredItemsAndUIs = {
  items: [] as any[],
  UIs: [] as UserInteraction[],
};

type FilterItemsAndUIs = typeof filteredItemsAndUIs;
