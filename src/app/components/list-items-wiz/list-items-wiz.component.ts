import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { Web3Service } from '../../shared/web3.service';
import { Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { ListItemsComponent } from '../list-items/list-items.component';
import { SteamApiService } from '../../shared/steamApi.service';
import { SignItemsComponent } from './utils/sign-items/sign-items.component';

@Component({
  selector: 'app-list-items-wiz',
  templateUrl: './list-items-wiz.component.html',
  styleUrls: ['./list-items-wiz.component.scss']
})
export class ListItemsWizComponent implements OnDestroy, OnInit {
  web3AccSub?: Subscription;

  tradeUrlStepBuilder: FormBuilder | any;
  itemStepBuilder: FormBuilder | any;
  signStepBuilder: FormBuilder | any;

  @ViewChild('stepper') stepper: MatStepper | undefined;
  @ViewChild(ListItemsComponent) listItemsComponent: ListItemsComponent | undefined;
  @ViewChild(SignItemsComponent) signItemsComponent: SignItemsComponent | undefined;

  constructor(
    private readonly web3: Web3Service,
    private readonly _formBuilder: FormBuilder,
    private readonly notify: NotificationService,
    private readonly steamApi: SteamApiService,
    //private readonly inspectHelpDialog: MatDialogRef<InspectHelpDialogComponent>,
  ) {
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
    this.tradeUrlStepBuilder = this._formBuilder.group({
      // itemNameControl: ['', [Validators.required, Validators.pattern(this.regExPattern)]],
      // priceControl: ['', [Validators.required, this._positiveNumberValidator, this._validNumberValidator]], /^steam:\/\/rungame\/730\/\d+\/[+ ]csgo_econ_action_preview [SM]\d+A\d+D\d+$/g
      tradeLinkControl: ['', [Validators.required, Validators.pattern(/^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=\d+&token=.+$/)]],
      // inspectLinkControl: [
      //   '',
      //   [ ///^steam:\/\/rungame\/730\/76561202255233023\/\+csgo_econ_action_preview%20/
      //     Validators.required,
      //     Validators.pattern(
      //       /^steam:\/\/rungame\/\d+\/\d+\/\+csgo_econ_action_preview%20S\d+A\d+D\d+$/
      //     ),
      //   ],
      // ],
      apiNonControl: [
        '',
        [],
      ],
    });

    // this.tradeUrlStepBuilder = this._formBuilder.group({ ??? });

    this.itemStepBuilder = this._formBuilder.group({
      itemsChildCheckValid: ['', [Validators.required]],
    });

    this.signStepBuilder = this._formBuilder.group({
      nonControl: ['', []],
    });
  }

  ngOnInit(): void {
    this.checkAndValidateLocalStorageTradeUrl();
  }

  localStorageTradeUrl: string = '';
  hasLocalStorageUrl: boolean = false;
  private checkAndValidateLocalStorageTradeUrl() {
    const tradeUrl = localStorage.getItem('tradeLinkUrl');
    if (tradeUrl) {
      this.localStorageTradeUrl = tradeUrl;
      this.hasLocalStorageUrl = true;
      this.tradeUrlStepBuilder.get('tradeLinkControl').setValue(tradeUrl);
    }
  }

  private _positiveNumberValidator(control: any): any {
    if (control.value <= 0) {
      return { positiveNumber: true };
    }
    return null;
  }

  private _validNumberValidator(control: any): any {
    if (control.value > 10000) {
      return { validNumber: true };
    }
    return null;
  }

  runAfterWeb3Init(): void {
    //..
    this.apiStatus();
  }

  ngOnDestroy(): void {
    this.web3AccSub?.unsubscribe();
  }

  onStepChange(event: any): void {
    //..
    console.log("onStepChange",event);
  }

  tradeUrl: string = '';
  validateTradeUrl(): void {
    if (this.tradeUrlStepBuilder.valid) {
      this.tradeUrl = this.tradeUrlStepBuilder.value.tradeLinkControl;
      this.listItemsComponent!.tradeLink = this.tradeUrl;
      this.listItemsComponent?.addItem();
      //this.listItemsComponent?.itemDetails;
      //this.listItemsComponent?.testAddManyInspectUrls();
      localStorage.setItem('tradeLinkUrl', this.tradeUrl);
      this.stepper?.next();
    } else {
      this.notify.openSnackBar('INVALID_TRADE_URL', 'gg, okay🤦');
    }
  }

  hasMadeItems: boolean = false;
  validateItem(): void {
    const isFormValid = this.listItemsComponent?.isFormValid();
    console.log(this.listItemsComponent?.items);
    if (!this.listItemsComponent?.items.valid) {
      this.notify.openSnackBar('Bro forgot something 😭', 'gg');
      return;
    }
    if (isFormValid) {
      // Get the item name and price from the list-items component
      const items = this.listItemsComponent?.items;

      // if items.value array is empty, itemStepBuilder is not valid
      if (!items || items?.value.length === 0) {
        this.notify.openSnackBar('Bro forgot the items 😭', 'ggs');
        this.stepper!.selectedIndex = 1;
        return;
      }

      // Check if tradelink is valid compared to items



      // itemsChildCheckValid
      this.itemStepBuilder.get('itemsChildCheckValid').setValue('VALID');


      const itemDetails = this.listItemsComponent?.itemDetails;
      this.signItemsComponent?.loadItems(itemDetails);

      this.hasMadeItems = true;

      // go to next step
      this.stepper?.next();

      // array of items even if there is only one item
      // Start signing items and call on chain function createListing
      // this.web3.createListing(items);  
    }
    console.log(this.itemStepBuilder.valid);
  }

  resetItemStep(): void {
    this.listItemsComponent?.resetForm();
    //this.tradeUrlStepBuilder.get('tradeLinkControl').setValue('');
    //this.tradeUrl = '';
    this.itemStepBuilder.get('itemsChildCheckValid').setValue('');
    this.stepper!.selectedIndex = 0;
  }

  // API KEY

  selectedChips: any[] = [];
  apiKeyIsSelected: boolean = false;
  onChipsChange() {
    console.log('Selected chips:', this.selectedChips);
    if (this.selectedChips == undefined || this.selectedChips.length == 0) {
      this.apiKeyIsSelected = false;
    } else {
      this.apiKeyIsSelected = true;
    }
  }

  hasApiKey: boolean = false;
  private apiStatus() {
    this.steamApi.isAddressRegistered(this.web3.webUser.address!).then((res: any) => {
      console.log("this.web3.webUser.address", this.web3.webUser.address);
      console.log("res", res);
      
      
      if (res.error) {
        this.hasApiKey = false;
      }

      if (res.is) {
        this.hasApiKey = true;
        console.log("HAS API KEY", this.hasApiKey);
      }
      //console.log("res", res);
    }).catch((err: any) => {
      console.log("err", err);
    });
  }

  isEnteringApiKey: boolean = false;
  enterApiKey() {
    this.isEnteringApiKey = true;
    const key = this.tradeUrlStepBuilder.get('apiNonControl').value;

    if (key == undefined || key == '') {
      this.notify.openSnackBar('INVALID_API_KEY', 'gg, okay🤦');
      this.isEnteringApiKey = false;
      return;
    }

    this.steamApi.AddOrChangeApiKey(key).then((res: any) => {
      //console.log("res", res);
      if (res.code == 4001) {
        this.notify.openSnackBar('WALLET_SIGNATURE_REJECTION.', 'gg, okay🤦');
        this.tradeUrlStepBuilder.get('apiNonControl').setValue('');
        this.isEnteringApiKey = false;
      }
      if (res.error) {
        this.notify.openSnackBar(res.error, 'gg, okay🤦');
        this.isEnteringApiKey = false;
      }

      if (res.saved) {
        this.notify.openSnackBar('API Key added successfully!', 'Cool!');
        this.tradeUrlStepBuilder.get('apiNonControl').setValue('');
        this.hasApiKey = true;
        this.selectedChips = [];
        this.apiKeyIsSelected = false;
        this.isEnteringApiKey = false;
      }
    }).catch((err: any) => {
      console.log("err", err);
      this.notify.openSnackBar(err, 'gg, okay🤦');
      this.tradeUrlStepBuilder.get('apiNonControl').setValue('');
      this.isEnteringApiKey = false;
    });
  }

}
