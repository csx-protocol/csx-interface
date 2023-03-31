import { Injectable } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { TradeRole, TradeStatus, UserInteraction } from './my-trades.component';

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
export class MyTradesService {
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
  constructor(public web3: Web3Service) {
    this.init();
  }

  async init() {
    if(!this.initialized) {
      this.initialized = true;
      this.totalUserTrades = await this._getTradesTotal();
      this.userUIs = await this._getTradeUIs(this.totalUserTrades);

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

        const pendings = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Pending
        );
        this.filterToData.set('PENDING', {
          UIs: pendings,
          items: [],
        });

        const sellerCancelled = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.SellerCancelled
        );
        this.filterToData.set('SELLER_CANCELLED', {
          UIs: sellerCancelled,
          items: [],
        });

        const committeds = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Committed
        );
        this.filterToData.set('COMMITTED', {
          UIs: committeds,
          items: [],
        });

        const accepted = this.userUIs.filter(
          (ui) => ui.status == TradeStatus.Accepted
        );
        this.filterToData.set('ACCEPTED', {
          UIs: accepted,
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
      }
      console.log('userUIs', this.userUIs);
      this.userItems = await this._loadFirstStep('ANY');
      console.log('userItems', this.userItems);
      this.isLoading = false;
    }
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
        console.log('filteredObject', filteredObject);

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
          console.log('MY-TRADES: Dont have items in map');
          console.log('this.filterToData', this.filterToData);

          for (const item of filteredObject.UIs) {
            if (_filteredItems.length >= this.step) {
              break;
            }
            let details = await this.web3.getTradeDetailsByAddress(
              item.contractAddress
            );
            details = {
              ...details,
              uiInfo: {
                ...item,
                status: this.__getStatusString(item.status),
                role: this.__getRoleString(item.role),
              },
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
      }

      //
    } // else if (isTradeRole(selectedFilter)) {
    //   console.log('isTradeRole selectedFilter', selectedFilter);
    // } else if (isTradeStatus(selectedFilter)) {
    //   console.log('isTradeStatus selectedFilter', selectedFilter);
    // }
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

        details = {
          ...details,
          uiInfo: {
            ...item,
            status: this.__getStatusString(item.status as string),
            role: this.__getRoleString(item.role as string),
          },
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
    return await this.web3.getUserTotalTradeUIs();
  }

  private async _getTradeUIs(_total: number) {
    let trades = [];

    for (let i = 0; i < _total; i++) {
      trades.push(await this.web3.getUserTradeUIByIndex(i));
    }

    return trades;
  }

  // async getTrade(index: number) {
  //   let trade = await this.web3.getUserTradeUIByIndex(index);
  //   return {
  //     contractAddress: trade[0],
  //     tradeRole: TradeRole[trade[1] as TradeRole],
  //     tradeStatus: TradeStatus[trade[2] as TradeStatus],
  //   };
  // }

  // async onRoleFilterChange(role?: TradeRole) {
  //   this.isLoading = true;
  //   if (role === undefined) {
  //     this.userUIs = this.filterToData.get('ANY')!.UIs;
  //   } else if (role === TradeRole.SELLER) {
  //     this.userUIs = this.filterToData.get('SELLER')!.UIs;
  //   } else if (role === TradeRole.BUYER) {
  //     this.userUIs = this.filterToData.get('BUYER')!.UIs;
  //   }
  //   this.isLoading = false;
  // }

  // async getUserUIsByRole(role: TradeRole): Promise<UserInteraction[]> {
  //   return this.userUIs.filter((ui) => ui.role === role);
  // }

  // async getUserUIsByStatus(status: TradeStatus): Promise<UserInteraction[]> {
  //   return this.userUIs.filter((ui) => ui.status === status);
  // }

  private __getStatusString(status: TradeStatus | string): string {
    switch (status) {
      case '0' || TradeStatus.Pending:
        return 'Pending';
      case '1' || TradeStatus.SellerCancelled:
        return 'Seller Cancelled';
      case '2' || TradeStatus.Committed:
        return 'Committed';
      case '3' || TradeStatus.Accepted:
        return 'Accepted';
      case '4' || TradeStatus.Completed:
        return 'Completed';
      case '5' || TradeStatus.Disputed:
        return 'Disputed';
      case '6' || TradeStatus.Resolved:
        return 'Resolved';
      case '7' || TradeStatus.Clawbacked:
        return 'Clawbacked';
      default:
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

  cancelTrade(contractAddress: string) {
    this.web3.cancelTrade(contractAddress);
  }
}

const filteredItemsAndUIs = {
  items: [] as any[],
  UIs: [] as UserInteraction[],
};

type FilterItemsAndUIs = typeof filteredItemsAndUIs;
