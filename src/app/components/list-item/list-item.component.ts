import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Web3Service } from '../../shared/web3.service';
import { CsgoItemsService } from '../../shared/csgo-items.service';
import { NotificationService } from '../../shared/notification.service';
import { debounceTime, map, Observable, startWith, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { SteamApiService } from '../../../app/shared/steamApi.service';
@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class ListItemComponent implements OnDestroy {
  web3AccSub?: Subscription;
  
  selectedPriceType = 'USDC';
  @ViewChild('stepper') stepper: MatStepper | undefined;

  selectItem: FormBuilder | any;

  selectStepTwo: FormBuilder | any;

  filteredItemNameSuggestions: Observable<{ name: string; link: string }[]>;

  constructor(
    private _formBuilder: FormBuilder,
    public web3: Web3Service,
    public csgoItems: CsgoItemsService,
    private notiServ: NotificationService,
    private steamApi: SteamApiService
  ) {
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
    //this.regExPattern = this._getRegExPatternFromItems();
    this.selectItem = this._formBuilder.group({
      // itemNameControl: ['', [Validators.required, Validators.pattern(this.regExPattern)]],
      // priceControl: ['', [Validators.required, this._positiveNumberValidator, this._validNumberValidator]], /^steam:\/\/rungame\/730\/\d+\/[+ ]csgo_econ_action_preview [SM]\d+A\d+D\d+$/g
      // tradeLinkControl: ['', [Validators.required, Validators.pattern(/^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=.+$/)]],
      inspectLinkControl: [
        '',
        [ ///^steam:\/\/rungame\/730\/76561202255233023\/\+csgo_econ_action_preview%20/
          Validators.required,
          Validators.pattern(
            /^steam:\/\/rungame\/\d+\/\d+\/\+csgo_econ_action_preview%20S\d+A\d+D\d+$/
          ),
        ],
      ],
    });

    

    this.selectStepTwo = this._formBuilder.group({
      itemNameControl: [
        '',
        [Validators.required],
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
      apiNonControl: [
        '',
        [],
      ],

    }, { validator: this.matchingFieldsValidator() });

    this.filteredItemNameSuggestions = this.selectStepTwo
      .get('itemNameControl')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map((value: string) => this._filterItemNames(value).slice(0, 25))
      );
  }

  runAfterWeb3Init() {
    this.apiStatus();
  }

  ngOnDestroy() {
    this.web3AccSub?.unsubscribe();
  }

  matchingFieldsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const tradeLink = control.get('tradeLinkControl')?.value;

      const SteamID64TradeUrl = this._tradeUrlToSteamID64(tradeLink);
      // Tradelink's
      const SteamID64InspectUrl = this._itemInspectUrlToSteamID64(this.itemInspectLink);

      // console.log("TRADE:", SteamID64TradeUrl);
      // console.log("INSPECT:", SteamID64InspectUrl);

      const res = SteamID64TradeUrl !== SteamID64InspectUrl ? { matchingFields: true } : null;
      // console.log("RESASa", res);


      return SteamID64TradeUrl !== SteamID64InspectUrl ? { matchingFields: true } : null;
    };
  }

  private _itemInspectUrlToSteamID64(itemInspectLink: string): string | null {
    const regex = /S(\d+)A/;
    const match = itemInspectLink.match(regex);
    if (match && match.length > 1) {
      return match[1];
    }
    return null;
  }

  isValidSteamIDMatching(): boolean {
    const tradeLink = this.selectStepTwo.get('tradeLinkControl').value;
    const steamIdTradeUrl = this._tradeUrlToSteamID64(tradeLink);
    const SteamIDInspectUrl = this._itemInspectUrlToSteamID64(this.itemInspectLink);
    return steamIdTradeUrl !== SteamIDInspectUrl;
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



  private _filterItemNames(value: string): { name: string; link: string }[] {
    if (value != null) {
      const filterValue = value.toLowerCase();
      return this.csgoItems.itemsArray.filter((_item: { name: string }) =>
        _item.name.toLowerCase().includes(filterValue)
      );
    }
    return [];
  }

  onStepChange(event: any): void {
    // console.log('EVENT', event);

    if (event.selectedIndex === 2) {
      this.confirmDetails();
    }
  }

  wear_ranges = [
    [0.0, 0.07],
    [0.07, 0.15],
    [0.15, 0.38],
    [0.38, 0.45],
    [0.45, 1.0],
  ];
  wear_names = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred',
  ];

  tradeLinkDestinationLink: string = '';
  minFloat: number = 0;
  maxFloat: number = 0;
  float_val: number = 0;
  exactImage: any = '';

  itemData?: any;

  ethPrice: number = 0;

  tempAssetId: any;
  itemInspectLink: string = '';

  isStickerAsItem: boolean = false;
  confirmDetails(): void {
    this.minFloat = 0;
    this.maxFloat = 0;
    this.float_val = 0;
    this.exactImage = '';
    this.itemData = undefined;
    this.tempAssetId = undefined;
    this.itemInspectLink = '';

    if (this.selectItem.valid) {
      //let price = this.selectStepTwo.get('priceControl').value;
      //const itemNameValueGiven = this.selectItem.get('itemNameControl').value;
      const itemInspectLink = this.selectItem.get('inspectLinkControl').value;
      this.itemInspectLink = itemInspectLink;
      //console.log('itemInspectLink', itemInspectLink);

      const SteamIDInspectUrl = this._itemInspectUrlToSteamID64(this.itemInspectLink);
      //https://steamcommunity.com/profiles/76561198185748194/tradeoffers/privacy#trade_offer_access_url
      this.tradeLinkDestinationLink = `https://steamcommunity.com/profiles/${SteamIDInspectUrl}/tradeoffers/privacy#trade_offer_access_url`;

      this.csgoItems.getItemInfo(itemInspectLink).subscribe(
        async (data: any) => {
          //console.log("DATAZ", data);

          if (data.iteminfo) {
            this.itemData = data.iteminfo;
            // Display Skin Image & Name
            // console.log("steamId64?",this.csgoItems.partnerIdToSteamId64("554900"));

            switch (data.iteminfo.weapon_type) {
              case 'Sticker':
                this.isStickerAsItem = true;
                //console.log("sticker it is!", data.iteminfo.full_item_name);
                const res = await this.csgoItems.getRegularItemImage(data.iteminfo.full_item_name);
                this.exactImage = res.url;
                break;
              case 'Graffiti':
                this.stepper!.selectedIndex = 0;
                this.selectItem.get('inspectLinkControl').setValue('');
                this.notiServ.openSnackBar(data.iteminfo.weapon_type + ' is not marketable yet.', 'gg, okay🤦');
                break;
              default:
                if (data.iteminfo.floatvalue > data.iteminfo.min) {
                  if (data.iteminfo.imageurl) {
                    this.exactImage = data.iteminfo.imageurl;
                    //const resII = await this.csgoItems.getRegularItemImage(data.iteminfo.full_item_name, 'Weapon');
                    //this.exactImage = resII.url;
                  }

                  if (data.iteminfo.stickers && data.iteminfo.stickers.length > 0) {
                    let stickers: any = [];
                    for (const _sticker of data.iteminfo.stickers) {
                      const full_market_name = "Sticker | " + _sticker.name;
                      const imageRes = await this.csgoItems.getRegularItemImage(full_market_name);
                      stickers.push({ name: _sticker.name, material: _sticker.material, slot: _sticker.slot, imageLink: imageRes.url });
                    }
                    this.itemData = { ...this.itemData, stickers: stickers }
                  }
                  //console.log("whats hood", this.itemData);

                  this.isStickerAsItem = false;
                } else {
                  this.notiServ.openSnackBar(data.iteminfo.weapon_type + ' is not marketable yet.', 'gg, okay🤦');
                  this.stepper!.selectedIndex = 0;
                }
                break;
            }

            this.minFloat = parseFloat(data.iteminfo.min);
            this.maxFloat = parseFloat(data.iteminfo.max);
            this.float_val = data.iteminfo.floatvalue;
            this.tempAssetId = data.iteminfo.a;

            //console.log(data.iteminfo.full_item_name);

            this.selectStepTwo
              .get('itemNameControl')
              .setValue(data.iteminfo.full_item_name);

          } else {
            this.notiServ.openSnackBar(data, 'gg, okay🤦');
            this.stepper!.selectedIndex = 0;
          }
        },
        (error: any) => {
          console.log(error);
        }
      );

    } else {
      console.log('not valid!!');
    }
  }

  loadingMetaMask: boolean = false;
  successMetaMask: boolean = false;
  listedContractAddress: string = '';
  confirmApprove(): void {
    const key = this.selectStepTwo.get('apiNonControl').value;

    if(key != undefined && key != '') {
      const prefixActionRef = this.hasApiKey ? 'Change' : 'Add';
      this.notiServ.openSnackBar(`Seems like you have inserted your api-key but did not add it, please click on the ${prefixActionRef} API-KEY? chip and press 'Add' or empty the field to skip.`, 'gg, okay🤦');
      return;
    }

    if (this.selectStepTwo.valid) {
      this.loadingMetaMask = true;
      const ethPrice = this.selectStepTwo.get('priceControl').value;
      const tradeLink = this.selectStepTwo.get('tradeLinkControl').value;

      const weaponType = this.itemData.weapon_type;
      const itemInspectLink = this.selectItem.get('inspectLinkControl').value;
      const priceType = this.selectedPriceType == 'ETH' ? '0' : this.selectedPriceType == 'USDC' ? '1' : '2';
      //console.log("priceType", priceType);
      //console.log('selectedPriceType', this.selectedPriceType);
      
      

      const weiPrice = priceType == '0' ? this.web3.toWei(ethPrice.toString(), 'ether') : this.web3.fromBaseUnitToSmallestUnit(ethPrice.toString());

      const _stickers = !this.isStickerAsItem ? this.itemData.stickers : [];

      this.web3.listItem(
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

    } else {
      const itemNameInspectionValue = this.selectStepTwo.get('itemNameControl').value;
      // if (this.regExPattern.test(itemNameInspectionValue) == false) {
      //   this.notiServ.openSnackBar(`${itemNameInspectionValue} is not an recognized item.`, 'gg, okay🤦');
      // }
    }
  }

  // private _getRegExPatternFromItems(): RegExp {
  //   const allowedItems = Object.keys(this.csgoItems.itemsObject);

  //   const pattern = new RegExp(
  //     `^(${allowedItems
  //       .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  //       .join('|')})$`
  //   );
  //   return pattern;
  // }

  private _positiveNumberValidator(
    control: FormControl
  ): { [s: string]: boolean } | null {
    if (control.value <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  _validNumberValidator(control: FormControl): { [s: string]: boolean } | null {
    if (isNaN(control.value)) {
      return { validNumber: true };
    }
    return null;
  }

  selectedChips: any[] = [];
  apiKeyIsSelected: boolean = false;
  onChipsChange() {
    console.log('Selected chips:', this.selectedChips);
    if(this.selectedChips == undefined || this.selectedChips.length == 0) {
      this.apiKeyIsSelected = false;
    } else {
      this.apiKeyIsSelected = true;
    }
  }

  hasApiKey: boolean = false;
  private apiStatus() {
    this.steamApi.isAddressRegistered(this.web3.webUser.address!).then((res: any) => {
      if(res.error) {
        this.hasApiKey = false;
      }

      if(res.is){
        this.hasApiKey = true;
      }
      //console.log("res", res);
    }).catch((err: any) => {
      console.log("err", err);
    });
  }

  isEnteringApiKey: boolean = false;
  enterApiKey() {
    this.isEnteringApiKey = true;
    const key = this.selectStepTwo.get('apiNonControl').value;
    
    if(key == undefined || key == '') {
      this.notiServ.openSnackBar('INVALID_API_KEY', 'gg, okay🤦');
      this.isEnteringApiKey = false;
      return;
    }
    
    this.steamApi.AddOrChangeApiKey(key).then((res: any) => {
      //console.log("res", res);
      if(res.code == 4001) {
        this.notiServ.openSnackBar('WALLET_SIGNATURE_REJECTION.', 'gg, okay🤦');
        this.selectStepTwo.get('apiNonControl').setValue('');
        this.isEnteringApiKey = false;
      }
      if(res.error) {
        this.notiServ.openSnackBar(res.error, 'gg, okay🤦');
        this.isEnteringApiKey = false;
      }
  
      if(res.saved) {
        this.notiServ.openSnackBar('API Key added successfully!', 'Cool!');
        this.selectStepTwo.get('apiNonControl').setValue('');
        this.hasApiKey = true;
        this.selectedChips = [];
        this.apiKeyIsSelected = false;
        this.isEnteringApiKey = false;        
      }
    }).catch((err: any) => {
      console.log("err", err);
      this.notiServ.openSnackBar(err, 'gg, okay🤦');
      this.selectStepTwo.get('apiNonControl').setValue('');
      this.isEnteringApiKey = false;
    });
  }
  


}

interface Order {
  itemName: string;
  priceInEther: string;
  tradeLink: string;
  inspectLink: string;
}
