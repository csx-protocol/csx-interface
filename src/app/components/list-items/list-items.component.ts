import { trigger, state, style, transition, animate } from '@angular/animations';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, Input, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CsgoItemsService } from 'src/app/shared/csgo-items.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { Web3Service } from 'src/app/shared/web3.service';
import { InspectHelpDialogComponent } from './dialogs/inspect-help-dialog/inspect-help-dialog.component';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  animations: [
    trigger('cardAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate(150),
      ]),
      transition('* => void', [
        animate(150, style({ opacity: 0, transform: 'scale(0.5)' })),
      ]),
    ]),
  ],
})
export class ListItemsComponent implements OnDestroy {
  @Input() tradeLink?: string;
  @Input() hasApiKey?: boolean;
  @Input() inspectLinks?: string[];
  
  web3AccSub?: Subscription;
  // userInfo: UserListInfo = {
  //   tradeLink: this.tradeLink || '',
  //   hasApiKey: this.hasApiKey || false,
  // };
  itemDetails: ItemDetails[] = [];

  itemForm: FormGroup | any;

  constructor(
    private readonly web3: Web3Service,
    private readonly _formBuilder: FormBuilder,
    private readonly csgoItems: CsgoItemsService,
    private readonly notify: NotificationService,
    private readonly dialog: MatDialog,
  ) {
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
  }

  openDialogInspectLink() {
    // open with this.userInfo
    const dialogRef = this.dialog.open(InspectHelpDialogComponent, {
      data: this.tradeLink,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // first dirty element input or first element input
      const firstDirtyInput = this.inspectInputs?.find(input => input.nativeElement.classList.contains('ng-invalid'));
      if (firstDirtyInput) {
        firstDirtyInput.nativeElement.focus();
      } else {
        this.inspectInputs?.first?.nativeElement.focus();
      }
    });
  }

  isFormValid(): boolean {
    return this.itemForm?.valid ?? false;
  }

  resetForm(): void {
    this.items.clear();
    this.itemDetails = [];
  }

  get items(): FormArray {
    if (!this.itemForm) return new FormArray<any>([]);
    return this.itemForm.get('items') as FormArray;
  }

  get ItemControl(): FormGroup<{
    inspectLinkControl: FormControl<string | null>;
    priceControl: FormControl<string | null>;
    tradeLinkControl: FormControl<string | null>;
    apiNonControl: FormControl<string | null>;
  }> {
    const itemGroup = this._formBuilder.group({
      inspectLinkControl: [
        '',
        [ ///^steam:\/\/rungame\/730\/76561202255233023\/\+csgo_econ_action_preview%20/
          Validators.required,
          Validators.pattern(
            /^steam:\/\/rungame\/\d+\/\d+\/\+csgo_econ_action_preview%20S\d+A\d+D\d+$/
          ),
        ],
      ],
      priceControl: [
        '',
        [
          Validators.required,
          this._positiveNumberValidator,
          this._validNumberValidator,
        ],
      ],
      tradeLinkControl: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=.+$/
          ),
        ],
      ],
      apiNonControl: ['', []],
      // Add matching fields validator
    }, { validators: this.matchingFieldsValidator() });

    return itemGroup;
  }

  private inspectInputSubscription?: Subscription;
  @ViewChildren('inspectInput') inspectInputs?: QueryList<ElementRef>;
  async addItem(): Promise<void> {
    const itemGroup = this.ItemControl;
    const itemDetails: ItemDetails = {
      inspectLink: '',
      priceType: 'ETH',
      priceTypeIndex: '0',
      itemName: '',
      assetId: '',
      imageUrl: '',
      weiPrice: '0',
      floatVal: 0,
      floatMin: 0,
      floatMax: 0,
      paintSeed: '0',
      paintIndex: '0',
      stickers: [],
      weaponType: '',
      itemState: {
        hasLoadedInspectLink: false,
        loadingItem: false,
        successWallet: false,
        listedContractAddress: '',
        isItemSticker: false,
        itemGroup: this.ItemControl,
        steamId64: ''
      },
    };
    this.items.push(itemGroup);
    const index = this.items.length - 1;
    // set trade url
    this.items.controls[index].get('tradeLinkControl')?.setValue(this.tradeLink);
    // set hasApiKey
    this.items.controls[index].get('apiNonControl')?.setValue(this.hasApiKey);

    this.itemDetails.push(itemDetails);
    // Set timeout to ensure the view updates before trying to set focus
    this.inspectInputSubscription = this.inspectInputs?.changes.subscribe(async (inputs: QueryList<ElementRef>) => {
      // Focus on the last input element
      if (inputs.last) {
        setTimeout(() => {
          inputs.last.nativeElement.focus();
        });
      }
    });
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.itemDetails.splice(index, 1);
  }

  runAfterWeb3Init() {
    this.itemForm = this._formBuilder.group({
      items: this._formBuilder.array([])
    });
    if (this.inspectLinks) {
      this.onAddManyInspectUrls(this.inspectLinks.join(','));
    } else {
      //this.addItem();
    }
  }

  onSubmit() {
    console.log(`Form submitted: ${JSON.stringify(this.itemForm.value)}`);
    console.log(`Form valid: ${this.itemForm.valid}`);

    if (this.itemForm?.valid) {
      const itemsData = this.itemForm.value.items;
      itemsData.forEach((item: any) => {
        // Process each item data
        console.log(item); // Replace with actual processing logic
      });
    } else {

      // Handle invalid form
      this.itemForm.markAllAsTouched();
    }
  }

  isGenInspLinkInputChanged: boolean = false; // Property to track if input value has changed for animation
  onInputGenInspLink(index: number): boolean {
    const inspectLinkControl = this.items.controls[index].get('inspectLinkControl');
    if (inspectLinkControl)
      if (inspectLinkControl.value) {
        // Check so the inspect link is valid
        const isValid = inspectLinkControl.valid;
        if (!isValid) {
          console.log('Invalid inspect link');
          return false;
        }

        console.log('Valid inspect link', this.isGenInspLinkInputChanged);

        this.isGenInspLinkInputChanged = true;
        this.itemDetails[index].itemState.loadingItem = true;

        const inspectLink = inspectLinkControl.value;

        // check so that the inspect link is not already used
        const inspectLinkAlreadyUsed = this.itemDetails.find((item) => item.inspectLink === inspectLink);

        if (inspectLinkAlreadyUsed) {
          inspectLinkControl.setValue('');
          this.notify.openSnackBar('Item already listed.', 'OK');
          if (this.itemDetails[index]?.itemState) {
            this.itemDetails[index].itemState.loadingItem = false;
          } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
          return false;
        }

        // matchingFieldsValidator
        const matchingField = this.matchingFieldsValidator()
        const hasMatchingField = matchingField(this.items.controls[index]);

        if (hasMatchingField) {
          inspectLinkControl.setValue('');
          this.itemDetails[index].itemState.loadingItem = false;
          this.removeItem(index);
          this.notify.openSnackBar('Bro, tries to list other peoples items 😭', 'gg');
          this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
          return false;
        }

        return this.csgoItems.getItemInfo(inspectLink).subscribe(
          async (data: any) => {
            if (data.iteminfo) {
              const itemInfo = data.iteminfo;
              console.log('itemInfo', itemInfo);

              let _itemImage: string;
              console.log('wpn type', itemInfo.weapon_type);

              if (itemInfo.weapon_type == undefined) {
                inspectLinkControl.setValue('');
                this.notify.openSnackBar('Item not supported', 'OK');
                if (this.itemDetails[index]?.itemState) {
                  this.itemDetails[index].itemState.loadingItem = false;
                } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                return false;
              }

              if (itemInfo.weapon_type == 'Graffiti') {
                inspectLinkControl.setValue('');
                this.notify.openSnackBar('Graffitis is not supported', 'OK');
                if (this.itemDetails[index]?.itemState) {
                  this.itemDetails[index].itemState.loadingItem = false;
                } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                return false;
              }

              if (itemInfo.weapon_type.endsWith('Coin')) {
                inspectLinkControl.setValue('');
                this.notify.openSnackBar('Coins are not supported', 'OK');
                if (this.itemDetails[index]?.itemState) {
                  this.itemDetails[index].itemState.loadingItem = false;
                } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                return false;
              }

              if (itemInfo.weapon_type.includes('Operation')) {
                inspectLinkControl.setValue('');
                this.notify.openSnackBar('Operations are not supported', 'OK');
                if (this.itemDetails[index]?.itemState) {
                  this.itemDetails[index].itemState.loadingItem = false;
                } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                return false;
              }

              if (itemInfo.weapon_type == 'Sticker') {
                // if apiKey
                if(this.hasApiKey) {
                this.itemDetails[index].itemState.isItemSticker = true;
                const sM_RES = await this.csgoItems.getRegularItemImage(itemInfo.full_item_name);
                _itemImage = sM_RES.url;
                } else {
                  inspectLinkControl.setValue('');
                  this.notify.openSnackBar('Stickers are not supported without API key', 'OK');
                  if (this.itemDetails[index]?.itemState) {
                    this.itemDetails[index].itemState.loadingItem = false;
                  } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                  return false;
                }
              } // if ends with Pin
              else if (itemInfo.weapon_type.endsWith('Pin')) {
                const pinImage = await this.csgoItems.getRegularItemImage(itemInfo.full_item_name);
                _itemImage = pinImage.url;
              } else {
                _itemImage = itemInfo.imageurl;
              }

              if (_itemImage == undefined) {
                inspectLinkControl.setValue('');
                // notify user that graffiti is not supported
                this.notify.openSnackBar(`${itemInfo.weapon_type} not supported.`, 'OK');
                if (this.itemDetails[index]?.itemState) {
                  this.itemDetails[index].itemState.loadingItem = false;
                } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                return false;
              }

              let _stickers: any[] = [];

              if (itemInfo.weapon_type != 'Sticker') {
                if (data.iteminfo.stickers && data.iteminfo.stickers.length > 0) {
                  for (const _sticker of data.iteminfo.stickers) {
                    const full_market_name = "Sticker | " + _sticker.name;
                    const stickerImage = await this.csgoItems.getRegularItemImage(full_market_name);
                    _stickers.push({ name: _sticker.name, material: _sticker.material, slot: _sticker.slot, imageLink: stickerImage.url });
                  }
                }
              }

              const itemDetails: Partial<ItemDetails> = {
                inspectLink: inspectLink,
                itemName: itemInfo.full_item_name,
                assetId: itemInfo.a,
                imageUrl: _itemImage,
                floatVal: itemInfo.floatvalue,
                floatMin: itemInfo.min,
                floatMax: itemInfo.max,
                paintSeed: itemInfo.paintseed,
                paintIndex: itemInfo.paintindex,
                weaponType: itemInfo.weapon_type,
                stickers: _stickers,
                itemState: {
                  ...this.itemDetails[index].itemState,
                  steamId64: itemInfo.s,
                  hasLoadedInspectLink: true,
                }
              };
              this.itemDetails[index] = {
                ...this.itemDetails[index],
                ...itemDetails
              };
              inspectLinkControl.disable();
              console.log(this.itemDetails[index]);
              return this.inspectInputSubscription = this.inspectInputs?.changes.subscribe((inputs: QueryList<ElementRef>) => {
                // Focus on the last input element
                if (inputs.last) {
                  setTimeout(() => {
                    inputs.last.nativeElement.focus();
                    if (this.itemDetails[index]?.itemState) {
                      this.itemDetails[index].itemState.loadingItem = false;
                    }
                    this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
                    return true;
                  });
                }
              });
            } else {
              if (this.itemDetails[index]?.itemState) {
                this.itemDetails[index].itemState.loadingItem = false;
              } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
              return false;
            }
          },
          (error: any) => {
            if (this.itemDetails[index]?.itemState) {
              this.itemDetails[index].itemState.loadingItem = false;
            } this.onisGenInspLinkInputChangedToFalseIfNoOtherLoading();
            return false;
          }
        );
      }
    return false;
  }

  onInputPrice(index: number) {
    const priceControl = this.items.controls[index].get('priceControl');
    if (priceControl)
      if (priceControl.value) {
        const price = priceControl.value;
        const priceType = this.itemDetails[index].priceType;
        const unit = priceType === 'ETH' ? 'ether' : priceType === 'USDC' ? 'mwei' : priceType === 'USDT' ? 'mwei' : 'ERROR_UNIT_NOT_FOUND_FROM_PRICE_TYPE';
        const weiPrice = this.web3.toWei(price, unit);
        this.itemDetails[index].weiPrice = weiPrice;
      }
  }

  onisGenInspLinkInputChangedToFalseIfNoOtherLoading(): void {
    const isAnyLoading = this.itemDetails.some((item) => item.itemState.loadingItem);
    if (!isAnyLoading) {
      this.isGenInspLinkInputChanged = false;
    } else {
      // show the ones is loading:
      const loadingItems = this.itemDetails.filter((item) => item.itemState.loadingItem);
      console.log('loadingItems', loadingItems);
    }
  }

  async onAddManyInspectUrls(inspectUrls: string) {

    // check if array has index 0, if so, check if it is clean, then remove it

    if (this.items.controls[0]?.get('inspectLinkControl')?.value === '') {
      this.removeItem(0);
    }

    // TODO: Unsafe code

    // remove all spaces
    inspectUrls = inspectUrls.replace(/\s/g, '');
    const inspectUrlsArray = inspectUrls.split(',');

    let _alreadyUsedItemNames: string[] = [];
    if (!inspectUrlsArray) return;
    for (const inspectUrl of inspectUrlsArray) {
      //console.log(inspectUrl);      
      if (inspectUrl) {
        await this.addItem();

        const lastIndex = this.items.length - 1;

        const inspectLinkControl = this.items.controls[lastIndex].get('inspectLinkControl');
        console.log(this.itemDetails[lastIndex]);
        console.log(inspectLinkControl);

        if (inspectLinkControl) {
          // check so that the inspect link is not already used
          console.log('inspectLinkControl.value', inspectLinkControl.value);

          // change inspectControl value to inspectUrl
          inspectLinkControl.setValue(inspectUrl);

          const inspectLinkAlreadyUsed = this.itemDetails.find((item) => item.inspectLink === inspectLinkControl.value);
          console.log('inspectLinkAlreadyUsed', inspectLinkAlreadyUsed);
          if (inspectLinkAlreadyUsed) {
            inspectLinkControl.setValue('');
            this.removeItem(lastIndex);
            _alreadyUsedItemNames.push(inspectLinkAlreadyUsed.itemName);
            continue;
          }

          inspectLinkControl.setValue(inspectUrl);
          this.onInputGenInspLink(lastIndex);
        }
      }
    }
    if (_alreadyUsedItemNames.length > 0) {
      this.notify.openSnackBar(`The following items are already listed:\n\n ${_alreadyUsedItemNames.join(',\n ')}.`, 'OK');
    }
  }

  testAutoFillAllPrices(_waitUntil?: number) {
    setTimeout(() => {
      this.items.controls.forEach((item) => {
        item.get('priceControl')!.setValue('0.01');
        this.onInputPrice(this.items.controls.indexOf(item));
      });
    }, _waitUntil ? _waitUntil : 0);
  }

  async testAddManyInspectUrls() {
    // this.onAddManyInspectUrls(
    //   `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198093639365A30808606207D10090315378191556269, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198000553323A34894853062D7983305680385751132, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198185748194A29499479532D12576421044392984783`
    // );

    const inspectUrls 
    = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A34484920377D895761406380010743, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A34470203971D13890837276840198472, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A34323971924D586286463340729352, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256789834D9993101276801662396, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256788040D17044544333691931769, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256783335D7507080987985183759, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256780613D12317032764290277603, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256780536D6957608710054006886, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256780471D16762961065364562549, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256780413D9668672521844709558, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256780366D16303215663858914600, steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198249128626A4256780315D18612843684092574`;
    this.onAddManyInspectUrls(inspectUrls);
    this.testAutoFillAllPrices();
  }

  ngOnDestroy() {
    this.web3AccSub?.unsubscribe();
    this.inspectInputSubscription?.unsubscribe();
  }

  private _positiveNumberValidator(
    control: FormControl
  ): { [s: string]: boolean } | null {
    if (control.value <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  private _validNumberValidator(control: FormControl): { [s: string]: boolean } | null {
    if (isNaN(control.value)) {
      return { validNumber: true };
    }
    return null;
  }

  private matchingFieldsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const tradeLink = control.get('tradeLinkControl')?.value;
      const SteamID64TradeUrl = this._tradeUrlToSteamID64(tradeLink);

      // Tradelink's
      const itemInspectLink = control.get('inspectLinkControl')?.value;
      const SteamID64InspectUrl = this._itemInspectUrlToSteamID64(itemInspectLink);

      return SteamID64TradeUrl !== SteamID64InspectUrl ? { matchingFields: true } : null;
    };
  }

  private _tradeUrlToSteamID64(_tradeUrl: string): string | null {
    if (this.web3.isValidUrl(_tradeUrl)) {
      const url = _tradeUrl;
      const params = new URLSearchParams(new URL(url).search);
      const partnerId = params.get('partner');
      if (partnerId) {
        const partnerIdInt = parseInt(partnerId);
        return `7656119${partnerIdInt + 7960265728}`;
      }
    }
    return null;
  }

  private _itemInspectUrlToSteamID64(itemInspectLink: string): string | null {
    const regex = /S(\d+)A/;
    const match = itemInspectLink.match(regex);
    if (match && match.length > 1) {
      return match[1];
    }
    return null;
  }

}

export interface UserListInfo {
  tradeLink: string;
  hasApiKey: boolean;
}

export interface ItemDetails {
  inspectLink: string;
  priceType: 'ETH' | 'USDC' | 'USDT';
  priceTypeIndex: '0' | '1' | '2';
  itemName: string;
  assetId: string;
  imageUrl: string;
  weiPrice: string;
  floatVal: number;
  floatMin: number;
  floatMax: number;
  paintSeed: string;
  paintIndex: string;
  stickers: any[];
  weaponType: string;
  itemState: ItemState;
}

export interface ItemState {
  hasLoadedInspectLink: boolean;
  loadingItem: boolean;
  successWallet: boolean;
  listedContractAddress: string;
  isItemSticker: boolean;
  itemGroup: FormGroup<{
    inspectLinkControl: FormControl<string | null>;
    priceControl: FormControl<string | null>;
    tradeLinkControl: FormControl<string | null>;
    apiNonControl: FormControl<string | null>;
  }>;
  steamId64: string;
}