import { Injectable } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { TradeStatus } from '../my-trades/my-trades.component';
import { ReferralService } from '../../shared/referral.service';

@Injectable({
  providedIn: 'root',
})
export class RecentlyListedItemsService {
  isLoading: boolean = true;
  isLoadingChip: boolean = false;
  filterToData = new Map<string, FilterItemsAndIndex>();
  step:number = 0; //= 5;
  totalContracts: number = 0;
  initialized: boolean = false;
  filteredItems: any[] | undefined = undefined;
  selectedPriceFilter = 'ANY';
  selectedWeaponTypeFilter = 'ANY';
  selectedGunsTypeFilter = undefined;
  selectedRifleTypeFilter = undefined;
  hasMoreItemsToLoad = false;
  autoScroll = false;

  filteredNames: any[] | undefined = undefined;
  selectedName: string = '';

  pendings: any;

  constructor(private web3: Web3Service, private referralService: ReferralService) {}

  sortBy: 'index' | 'weiPrice' = 'index' as 'index' | 'weiPrice';
  sortDirection: 'asc' | 'desc' = 'desc';

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortKnownMappingsAndCurrentFilteredItems(this.sortBy, this.sortDirection);
  }

  async sortKnownMappingsAndCurrentFilteredItems(sortBy: 'index' | 'weiPrice', sortDirection: 'asc' | 'desc'){
    for (const iterator of this.filterToData) {
      // console.log('iteratooooor', iterator);
      //const filterName = iterator[0];
      const indexes = iterator[1].indexes;
      const items = iterator[1].items;

      iterator[1].indexes = this._sortObjects(indexes, sortBy, sortDirection)
      if(items.length !== 0){
        if(items.length === indexes.length){
          iterator[1].items = this._sortObjects(items, sortBy, sortDirection);
        } else {
          iterator[1].items = [];
        }
      }

      // iteratooooor output:
      /**
      [
          "MORE_THAN_1000",
          {
              "indexes": [
                  {
                      "0": "6",
                      "1": "1489077140000000000",
                      "2": "0",
                      "3": "Driver Gloves",
                      "4": "★ Driver Gloves | Rezan the Red (Minimal Wear)",
                      "5": "7",
                      "index": "6",
                      "weiPrice": "1489077140000000000",
                      "priceType": "0",
                      "weaponType": "Driver Gloves",
                      "itemMarketName": "★ Driver Gloves | Rezan the Red (Minimal Wear)",
                      "nextIndex": "7",
                      "etherPrice": "1.48907714",
                      "priceInUSD": 2419.6458043940006
                  }
              ],
              "items": []
          }
      ]
       */
    }
    // if(this.filteredItems)
    // if(this.filteredItems.length !== 0){
    //   console.log('filteredItems yes');

    //   // Cant do on this.filteredItems as first becomes 5th and not last, after next load its incorrect.
    //   // have to reload the 'lastSelectedFiltering'
    //   this.filteredItems = this._sortObjects(this.filteredItems, sortBy, sortDirection);
    //   console.log(this.filteredItems);

    // }

    if(this.pendings)
    this.pendings = this._sortObjects(this.pendings, sortBy, sortDirection);

    if (this.selectedName != '') {
      await this.filterNames({target: { value: this.selectedName}});
    } else {
      //
      if (
        this.selectedWeaponTypeFilter !== undefined &&
        this.selectedGunsTypeFilter == undefined
      ) {
        await this.onTypeFilterChange({ value: this.selectedWeaponTypeFilter });
      } else if (
        this.selectedGunsTypeFilter !== undefined &&
        this.selectedRifleTypeFilter == undefined
      ) {
        await this.onGunTypeFilterChange({
          value: this.selectedGunsTypeFilter,
        });
      } else if (this.selectedRifleTypeFilter !== undefined) {
        await this.onGunSpecificFilterChange({
          value: this.selectedRifleTypeFilter,
        });
      } else {
        await this.onPriceFilterChange({ value: this.selectedPriceFilter });
      }
      //
    }
  }

  _sortObjects(objects: any[], sortBy: 'index' | 'weiPrice', sortDirection: 'asc' | 'desc'): any[] {
    const directionMultiplier = sortDirection === 'desc' ? -1 : 1;
    return objects.sort((a, b) => {
      if (sortBy === 'index') {
        console.log(sortBy, directionMultiplier);
        if(a.index && b.index !== undefined){
          return directionMultiplier * (a.index - b.index);
        } else {
          return directionMultiplier * (a.indexInfo.index - b.indexInfo.index);
        }
      } else if (sortBy === 'weiPrice') {
        console.log(sortBy, directionMultiplier);
        if(a.priceInUSD && b.priceInUSD !== undefined){
         return directionMultiplier * (Number(a.priceInUSD) - Number(b.priceInUSD));
        } else {
          return directionMultiplier * (Number(a.indexInfo.priceInUSD) - Number(b.indexInfo.priceInUSD));
        }
      } else {
        return 0;
      }
    });
  }

  filterTimeout: any;
  async filterNames(event: any) {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(async () => {
      this._filterNames(event);
      console.log('RESULTS', this.filterToData);
    }, 10);
  }

  isSearching: boolean = false;
  // Fix LoadNextStep for FilterNames
  async _filterNames(event: any) {
    const filterValue = event.target.value.toLowerCase();
    //console.log('huh?',filterValue);
    if (filterValue.length === 0) {
      this.isSearching = false;
    } else {
      this.isSearching = true;
    }

    //AutoComplete
    // this.filteredNames = this.pendings
    //   .map((pending: any) => pending.itemMarketName)
    //   .filter((name: string) => name.toLowerCase().includes(filterValue));
    this.filteredNames = this.pendings.filter((pending: any) => {
      return pending.itemMarketName.toLowerCase().includes(filterValue);
    });

    if (filterValue != '') {
      if (this.filteredNames)
        if (this.filteredNames?.length !== 0) {
          let _filteredItems = [];
          for (const item of this.filteredNames) {
            if (_filteredItems.length >= this.step) {
              break;
            }
            let details = await this.web3.getTradeDetailsByIndex(item.index, this.referralInfo.hasReferral, this.referralInfo.discountRatio);
            const [max, min, value] = this.getFloatValues(details.skinInfo);
            details = { ...details, indexInfo: item, float: { max: max, min: min, value: value}};
            _filteredItems.push(details);
          }

          console.log(
            'setting filterValue',
            filterValue,
            this.filteredNames,
            _filteredItems
          );

          this.filterToData.set(filterValue, {
            indexes: this.filteredNames,
            items: _filteredItems,
          });

          // Set hasMoreItemsToLoad based on the total number of items available for the current filter
          const filteredObject = this.filterToData.get(filterValue);
          this.hasMoreItemsToLoad =
            (filteredObject?.indexes.length ?? 0) > _filteredItems.length;

          if (!this.hasMoreItemsToLoad) {
            this.autoScroll = false;
          }

          this.filteredItems = _filteredItems;
        }
    } else {
      //
      if (
        this.selectedWeaponTypeFilter !== undefined &&
        this.selectedGunsTypeFilter == undefined
      ) {
        await this.onTypeFilterChange({ value: this.selectedWeaponTypeFilter });
      } else if (
        this.selectedGunsTypeFilter !== undefined &&
        this.selectedRifleTypeFilter == undefined
      ) {
        await this.onGunTypeFilterChange({
          value: this.selectedGunsTypeFilter,
        });
      } else if (this.selectedRifleTypeFilter !== undefined) {
        await this.onGunSpecificFilterChange({
          value: this.selectedRifleTypeFilter,
        });
      } else {
        await this.onPriceFilterChange({ value: this.selectedPriceFilter });
      }
      //
    }

    //console.log('this.filteredNames', this.filteredNames);
  }

  clearInput() {
    this.selectedName = '';
    this.isSearching = false;
    this.filterNames({ target: { value: '' } });
  }

  onOptionSelected(event: any) {
    this.filterNames({ target: { value: event.option.value } });
  }

  //hasReferral: boolean = false;
  //discountRatio: number = 0;

  referralInfo: { 
    hasReferral: boolean, 
    buyerRatio: string, 
    ownerRatio: string, 
    owner: string, 
    discountRatio: number 
  } = { 
    hasReferral: false, 
    buyerRatio: '', 
    ownerRatio: '', 
    owner: '', 
    discountRatio: 0 
  };

  async initialize() {
    if (!this.initialized) {
      this.initialized = true;

      // Check if the user has valid referral code set.
      const [hasReferral, referralInfo] = await this.referralService.hasReferralCodeLocalOrChain();

      const discountRatio = parseInt(referralInfo?.buyerRatio ?? '0');
      this.referralInfo = {...referralInfo, discountRatio: discountRatio, hasReferral: hasReferral};

      const [pendings, totalContracts] = await this.web3.getTradeIndexesByStatus(
        TradeStatus.ForSale,
        0,
        0,
        hasReferral,
        discountRatio
      );

      this.totalContracts = totalContracts;
      console.log('GOTYOPENDINGs', pendings);
      console.log('totalContracts', totalContracts);
      
      //Sorting highest first, lowest last.
      this.pendings = pendings.sort(
        (a: { index: number }, b: { index: number }) => b.index - a.index
      );

      this.filterNames({ target: { value: '' } });

      if (this.totalContracts > 0) {
        this.filterToData.set('ANY', {
          indexes: pendings,
          items: [],
        });

        const LessThanTenfilteredIndexes = pendings.filter((item: any) => {
          const price = item.priceInUSD;
          return price < 10;
        });

        this.filterToData.set('LESS_THAN_10', {
          indexes: LessThanTenfilteredIndexes,
          items: [],
        });

        const filterPrices = [
          '10_TO_25',
          '25_TO_50',
          '50_TO_100',
          '100_TO_250',
          '250_TO_1000',
        ];
        const minPrices = [10, 25, 50, 100, 250];
        const maxPrices = [25, 50, 100, 250, 1000];

        for (let i = 0; i < minPrices.length; i++) {
          const filteredIndexes = pendings.filter((item: any) => {
            const price = item.priceInUSD;
            return price >= minPrices[i] && price <= maxPrices[i];
          });
          this.filterToData.set(filterPrices[i], {
            indexes: filteredIndexes,
            items: [],
          });
        }

        const MoreThanOneKfilteredIndexes = pendings.filter((item: any) => {
          const price = item.priceInUSD;
          return price > 1000;
        });
        this.filterToData.set('MORE_THAN_1000', {
          indexes: MoreThanOneKfilteredIndexes,
          items: [],
        });
      }
    }

    //this.filteredItems = await this._loadFirstStep('ANY');

    await this.onTypeFilterChange({ value: undefined });

    this.isLoading = false;
  }

  async _loadFirstStep(selectedFilter: string): Promise<any[]> {
    const hasKey = this.filterToData.has(selectedFilter);
    let _filteredItems = [];
    if (hasKey) {
      const filteredObject = this.filterToData.get(selectedFilter);
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
      } else if (filteredObject && filteredObject?.indexes) {
        for (const item of filteredObject.indexes) {
          if (_filteredItems.length >= this.step) {
            break;
          }
          let details = await this.web3.getTradeDetailsByIndex(item.index, this.referralInfo.hasReferral, this.referralInfo.discountRatio);
          const [max, min, value] = this.getFloatValues(details.skinInfo);
          details = { ...details, indexInfo: item, float: { max: max, min: min, value: value}};          
          _filteredItems.push(details);
        }
        console.log('SETTING: selectedFilter', selectedFilter);

        this.filterToData.set(selectedFilter, {
          items: _filteredItems,
          indexes: filteredObject.indexes,
        });
      }
      if (filteredObject)
        this.hasMoreItemsToLoad =
          _filteredItems.length < filteredObject.indexes.length;
    }
    return _filteredItems;
  }

  async loadNextStep() {
    this.isLoading = true;
    let _filteredItems = [];
    const selectedPriceFilter = this.selectedPriceFilter;
    const selectedWeaponTypeFilter = this.selectedWeaponTypeFilter;
    let selectedFilter;
    if (selectedWeaponTypeFilter !== undefined) {
      selectedFilter = selectedPriceFilter + selectedWeaponTypeFilter;
    } else if (this.selectedName !== '') {
      selectedFilter = this.selectedName;
    } else {
      selectedFilter = selectedPriceFilter;
    }

    // Check if the filter is in the filterToData map
    const hasKey = this.filterToData.has(selectedFilter);
    if (!hasKey) {
      // If the filter doesn't exist, call _loadFirstStep() to get it
      await this._loadFirstStep(selectedFilter);
    }

    // Get the filter from the filterToData map
    const filteredObject = this.filterToData.get(selectedFilter);
    const filteredIndexes = filteredObject?.indexes;
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
        let details = await this.web3.getTradeDetailsByIndex(item.index, this.referralInfo.hasReferral, this.referralInfo.discountRatio);
        const [max, min, value] = this.getFloatValues(details.skinInfo);
        details = { ...details, indexInfo: item, float: { max: max, min: min, value: value}};
        _filteredItems.push(details);
      }
      // console.log('SETTING: selectedFilter', selectedFilter);

      this.filterToData.set(selectedFilter, {
        items: [...filteredItems, ..._filteredItems],
        indexes: filteredIndexes,
      });

      this.filteredItems = [...filteredItems, ..._filteredItems];

      // Update hasMoreItemsToLoad based on the total number of items available for that filter
      const totalItems = filteredObject.indexes.length;
      this.hasMoreItemsToLoad = this.filteredItems.length < totalItems;

      if (!this.hasMoreItemsToLoad) {
        this.autoScroll = false;
      }
    }
    // console.log(this.filteredItems);

    this.isLoading = false;
  }

  async onPriceFilterChange(event: any) {
    this.isLoading = true;
    this.isLoadingChip = true;
    const selectedPriceFilter = event.value;
    this.selectedPriceFilter = selectedPriceFilter;
    let _filteredItems = [];

    // console.log('mgmawklsmfA,', selectedPriceFilter);

    if (selectedPriceFilter !== undefined) {
      _filteredItems = await this._loadFirstStep(selectedPriceFilter);
    } else {
      this.selectedPriceFilter = 'ANY';
      _filteredItems = await this._loadFirstStep(this.selectedPriceFilter);
    }

    // Update filtered items based on selected weapon type
    if (
      this.selectedWeaponTypeFilter !== undefined &&
      this.selectedGunsTypeFilter == undefined
    ) {
      await this.onTypeFilterChange({ value: this.selectedWeaponTypeFilter });
    } else if (
      this.selectedGunsTypeFilter !== undefined &&
      this.selectedRifleTypeFilter == undefined
    ) {
      await this.onGunTypeFilterChange({ value: this.selectedGunsTypeFilter });
    } else if (this.selectedRifleTypeFilter !== undefined) {
      await this.onGunSpecificFilterChange({
        value: this.selectedRifleTypeFilter,
      });
    } else {
      this.filteredItems = _filteredItems;
      this.hasMoreItemsToLoad =
        this.hasMoreItemsToLoad &&
        this.filteredItems.length < this.totalContracts;
    }

    this.isLoading = false;
    this.isLoadingChip = false;
  }

  isGunsSelected: boolean = false;
  isGlovesSelected: boolean = false;
  isKnivesSelected: boolean = false;
  async onTypeFilterChange(event: any) {
    this.isLoading = true;
    this.isLoadingChip = true;
    const selectedFilter = event.value;
    this.selectedWeaponTypeFilter = selectedFilter;

    if (this.selectedWeaponTypeFilter == 'GUNS') {
      this.isGunsSelected = true;
    } else {
      this.isGunsSelected = false;
      this.isRiflesSelected = false;
      this.isSmgsSelected = false;
      this.isHeavySelected = false;
      this.isPistolsSelected = false;

      this.selectedGunsTypeFilter = undefined;
      this.selectedRifleTypeFilter = undefined;
    }

    // Update filtered items based on selected weapon type
    let _filteredItems = [];
    let _filteredLength: number = 0;
    if (selectedFilter !== undefined) {
      console.log(
        'selectedPriceFilter',
        this.selectedPriceFilter,
        'selectedTypeFilter',
        selectedFilter,
        this.filterToData.get(this.selectedPriceFilter)?.indexes
      );

      const hasKey = this.filterToData.has(
        this.selectedPriceFilter + selectedFilter
      );
      if (!hasKey) {
        const _filteredIndexItems = this._filterItemsByWeaponType(
          this.filterToData.get(this.selectedPriceFilter)?.indexes ?? [],
          selectedFilter
        );

        for (const item of _filteredIndexItems) {
          if (_filteredItems.length >= this.step) {
            break;
          }
          let details = await this.web3.getTradeDetailsByIndex(item.index, this.referralInfo.hasReferral, this.referralInfo.discountRatio);
          const [max, min, value] = this.getFloatValues(details.skinInfo);
          details = { ...details, indexInfo: item, float: { max: max, min: min, value: value}};
          _filteredItems.push(details);
        }
        // console.log(
        //   'SETTING: this.selectedPriceFilter + selectedFilter',
        //   this.selectedPriceFilter + selectedFilter
        // );

        this.filterToData.set(this.selectedPriceFilter + selectedFilter, {
          indexes: _filteredIndexItems,
          items: _filteredItems,
        });
        _filteredLength = _filteredIndexItems.length;
      } else if (hasKey) {
        _filteredItems = await this._loadFirstStep(
          this.selectedPriceFilter + selectedFilter
        );
        _filteredLength =
          this.filterToData.get(this.selectedPriceFilter + selectedFilter)
            ?.indexes.length ?? 0;
      }

      this.filteredItems = _filteredItems;

      // Set hasMoreItemsToLoad based on the total number of items available for the current filter
      const filteredObject = this.filterToData.get(
        this.selectedPriceFilter + selectedFilter
      );
      this.hasMoreItemsToLoad =
        (filteredObject?.indexes.length ?? 0) > _filteredItems.length;

      if (!this.hasMoreItemsToLoad) {
        this.autoScroll = false;
      }

      this.isLoading = false;
      this.isLoadingChip = false;
    } else {
      //console.log('????', this.selectedPriceFilter);
      this.selectedGunsTypeFilter = undefined;
      await this.onPriceFilterChange({ value: this.selectedPriceFilter });
    }
  }

  _filterItemsByWeaponType(items: any[], weaponType: string) {
    console.log('AJT', items);
    // const filteredGloves = pendings.filter((item: any) =>
    //       this.gloves.includes(item.weaponType)
    //     );
    switch (weaponType) {
      case 'GLOVES':
        return items.filter((item: any) =>
          this.gloves.includes(item.weaponType)
        );
      case 'GUNS':
        const guns = [
          ...this.pistols,
          ...this.smgs,
          ...this.rifles,
          ...this.heavy,
        ];
        return items.filter((item: any) => guns.includes(item.weaponType));
      case 'KNIVES':
        return items.filter((item: any) =>
          this.knives.includes(item.weaponType)
        );
      case 'PISTOLS':
        return items.filter((item: any) =>
          this.pistols.includes(item.weaponType)
        );
      case 'HEAVY':
        return items.filter((item: any) =>
          this.heavy.includes(item.weaponType)
        );
      case 'SMGS':
        return items.filter((item: any) =>
          this.smgs.includes(item.weaponType)
        );
      case 'RIFLES':
        return items.filter((item: any) =>
          this.rifles.includes(item.weaponType)
        );
      default:
        return items.filter((item: any) => item.weaponType === weaponType);
    }
  }

  isPistolsSelected: boolean = false;
  isHeavySelected: boolean = false;
  isSmgsSelected: boolean = false;
  isRiflesSelected: boolean = false;
  async onGunTypeFilterChange(event: any) {
    this.isLoading = true;
    this.isLoadingChip = true;
    const selectedFilter = event.value;
    this.selectedGunsTypeFilter = selectedFilter;
    this.isGunsSelected = true;

    this.isRiflesSelected = false;
    this.isSmgsSelected = false;
    this.isHeavySelected = false;
    this.isPistolsSelected = false;
    this.selectedRifleTypeFilter = undefined;

    if (this.selectedGunsTypeFilter == 'RIFLES') {
      this.isRiflesSelected = true;
    } else if (this.selectedGunsTypeFilter == 'SMGS') {
      this.isSmgsSelected = true;
    } else if (this.selectedGunsTypeFilter == 'HEAVY') {
      this.isHeavySelected = true;
    } else if (this.selectedGunsTypeFilter == 'PISTOLS') {
      this.isPistolsSelected = true;
    }

    let _filteredItems = [];
    let _filteredLength: number = 0;
    const selectedPriceFilter = this.selectedPriceFilter;

    if (selectedPriceFilter !== undefined) {
      let selectedFilterKey = selectedPriceFilter;
      if (selectedFilter !== undefined) {
        console.log(
          'selectedPriceFilter',
          this.selectedPriceFilter,
          'selectedGunTypeFilter',
          selectedFilter,
          this.filterToData.get(this.selectedPriceFilter)?.indexes
        );
        selectedFilterKey = selectedFilterKey + selectedFilter;
      } else if (
        selectedFilter == undefined &&
        this.selectedWeaponTypeFilter !== undefined
      ) {
        selectedFilterKey = selectedFilterKey + this.selectedWeaponTypeFilter;
      }

      const hasKey = this.filterToData.has(selectedFilterKey);
      if (!hasKey) {
        const filteredIndexes =
          this.filterToData.get(selectedPriceFilter)?.indexes ?? [];
        const _filteredIndexItems = this._filterItemsByWeaponType(
          filteredIndexes,
          selectedFilter
        );

        for (const item of _filteredIndexItems) {
          if (_filteredItems.length >= this.step) {
            break;
          }
          let details = await this.web3.getTradeDetailsByIndex(item.index, this.referralInfo.hasReferral, this.referralInfo.discountRatio);
          const [max, min, value] = this.getFloatValues(details.skinInfo);
          details = { ...details, indexInfo: item, float: { max: max, min: min, value: value}};
          _filteredItems.push(details);
        }
        console.log('SETTING: selectedFilterKey', selectedFilterKey);

        this.filterToData.set(selectedFilterKey, {
          indexes: _filteredIndexItems,
          items: _filteredItems,
        });
        _filteredLength = _filteredIndexItems.length;
      } else if (hasKey) {
        _filteredItems = await this._loadFirstStep(selectedFilterKey);
        _filteredLength =
          this.filterToData.get(selectedFilterKey)?.indexes.length ?? 0;
      }

      this.filteredItems = _filteredItems;

      // Set hasMoreItemsToLoad based on the total number of items available for the current filter
      const filteredObject = this.filterToData.get(selectedFilterKey);
      this.hasMoreItemsToLoad =
        (filteredObject?.indexes.length ?? 0) > _filteredItems.length;

      if (!this.hasMoreItemsToLoad) {
        this.autoScroll = false;
      }
    }

    this.isLoading = false;
    this.isLoadingChip = false;
  }

  async onGunSpecificFilterChange(event: any) {
    this.isLoading = true;
    this.isLoadingChip = true;
    const selectedFilter = event.value;
    this.selectedRifleTypeFilter = selectedFilter;
    this.isGunsSelected = true;

    // if (this.selectedGunsTypeFilter == 'RIFLES') {
    //   this.isRiflesSelected = true;
    // } else {
    //   this.isRiflesSelected = false;
    //   this.selectedRifleTypeFilter = undefined;
    // }

    let _filteredItems = [];
    let _filteredLength: number = 0;
    const selectedPriceFilter = this.selectedPriceFilter;

    if (selectedPriceFilter !== undefined) {
      let selectedFilterKey = selectedPriceFilter;
      if (selectedFilter !== undefined) {
        console.log(
          'selectedPriceFilter',
          this.selectedPriceFilter,
          'selectedGunTypeFilter',
          selectedFilter,
          this.filterToData.get(this.selectedPriceFilter)?.indexes
        );
        selectedFilterKey = selectedFilterKey + selectedFilter;
      } else if (this.selectedGunsTypeFilter !== undefined) {
        selectedFilterKey = selectedFilterKey + this.selectedGunsTypeFilter;
      }

      const hasKey = this.filterToData.has(selectedFilterKey);
      if (!hasKey) {
        const filteredIndexes =
          this.filterToData.get(selectedPriceFilter)?.indexes ?? [];
        const _filteredIndexItems = this._filterItemsByWeaponType(
          filteredIndexes,
          selectedFilter
        );

        for (const item of _filteredIndexItems) {
          if (_filteredItems.length >= this.step) {
            break;
          }
          let details = await this.web3.getTradeDetailsByIndex(item.index, this.referralInfo.hasReferral, this.referralInfo.discountRatio);
          const [max, min, value] = this.getFloatValues(details.skinInfo);
          details = { ...details, indexInfo: item, float: { max: max, min: min, value: value}};
          _filteredItems.push(details);
        }
        // console.log('SETTING: selectedFilterKey', selectedFilterKey);

        this.filterToData.set(selectedFilterKey, {
          indexes: _filteredIndexItems,
          items: _filteredItems,
        });
        _filteredLength = _filteredIndexItems.length;
      } else if (hasKey) {
        _filteredItems = await this._loadFirstStep(selectedFilterKey);
        _filteredLength =
          this.filterToData.get(selectedFilterKey)?.indexes.length ?? 0;
      }

      this.filteredItems = _filteredItems;

      // Set hasMoreItemsToLoad based on the total number of items available for the current filter
      const filteredObject = this.filterToData.get(selectedFilterKey);
      this.hasMoreItemsToLoad =
        (filteredObject?.indexes.length ?? 0) > _filteredItems.length;

      if (!this.hasMoreItemsToLoad) {
        this.autoScroll = false;
      }
    }

    this.isLoading = false;
    this.isLoadingChip = false;
  }

  readonly pistols = [
    'CZ75-Auto',
    'Desert Eagle',
    'Dual Berettas',
    'Five-SeveN',
    'Glock-18',
    'P2000',
    'P250',
    'R8 Revolver',
    'Tec-9',
    'USP-S',
  ];

  readonly smgs = [
    'MAC-10',
    'MP5-SD',
    'MP7',
    'MP9',
    'P90',
    'PP-Bizon',
    'UMP-45',
  ];

  readonly rifles = [
    'AWP',
    'SSG 08',
    'AK-47',
    'M4A4',
    'M4A1-S',
    'SG 553',
    'AUG',
    'Galil AR',
    'FAMAS',
    'G3SG1',
    'SCAR-20',
  ];

  readonly heavy = ['MAG-7', 'Nova', 'Sawed-Off', 'XM1014', 'M249', 'Negev'];

  readonly knives = [
    'Bayonet',
    'Bowie Knife',
    'Butterfly Knife',
    'Classic Knife',
    'Falchion Knife',
    'Flip Knife',
    'Gut Knife',
    'Huntsman Knife',
    'Karambit',
    'M9 Bayonet',
    'Navaja Knife',
    'Nomad Knife',
    'Paracord Knife',
    'Shadow Daggers',
    'Skeleton Knife',
    'Stiletto Knife',
    'Survival Knife',
    'Talon Knife',
    'Ursus Knife',
  ];

  readonly gloves = [
    'Hand Wraps',
    'Moto Gloves',
    'Specialist Gloves',
    'Bloodhound Gloves',
    'Hydra Gloves',
    'Broken Fang Gloves',
    'Driver Gloves',
  ];

  getFloatValues(skinInfo: any) {
    const floatValues = skinInfo.floatValues;
    const floatValuesArray = JSON.parse(floatValues);
    return floatValuesArray;
  }
}
const filteredItemsAndIndex = {
  items: [] as any[],
  indexes: [] as any[],
};

type FilterItemsAndIndex = typeof filteredItemsAndIndex;
