import { Component, ViewChild, HostListener, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Web3Service } from '../../shared/web3.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStep, MatStepper, StepperOrientation } from '@angular/material/stepper';
import { ReferralService } from '../../shared/referral.service';
import { BuyDialog } from '../../components/recently-listed-items/utils/buy.dialog';
import { MatDialog } from '@angular/material/dialog';
import { TimelineService } from './utils/timeline/timeline.service';
import { SubscriptionService } from '../../components/my-trades/dialogs/subscription.service';
import { MyTradeItem } from '../../components/my-trades/dialogs/my-trade-item.interface';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(620)
      ]),
      transition(':leave',
        animate(0, style({ opacity: 0 }))
      )
    ])
  ]
})
export class TradeComponent {
  public stepperOrientation: StepperOrientation = 'horizontal';
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setStepperOrientation();
  }
  web3AccSub?: Subscription;
  hasWeb3: boolean = false;
  hasValidTradeAddress: boolean = false;
  role: TradeRole = TradeRole.ANY;
  status: TradeStatus = TradeStatus.ANY;

  item: TradeItem = {
    assetId: '',
    averageSellerDeliveryTime: '',
    buyer: '',
    buyerTradeUrl: [],
    contractAddress: '',
    inspectLink: '',
    itemImageUrl: '',
    itemMarketName: '',
    priceType: 0,
    seller: '',
    sellerTradeUrl: [],
    status: '',
    stickers: [],
    weaponType: '',
    weiPrice: '',
    buyerShort: '',
    sellerShort: '',
    skinInfo: {
      floatValues: [],
      paintSeed: '',
      paintIndex: ''
    },
    indexInfo: {
      etherPrice: '',
      priceInUSD: 0,
    },
    float: {
      min: 0,
      max: 0,
      value: 0
    }
  };
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

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('midStep') midStep!: MatStep;
  @ViewChild('endStep') endStep!: MatStep;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private web3: Web3Service,
    private _formBuilder: FormBuilder,
    private referralService: ReferralService,
    private dialog: MatDialog,
    private timelineService: TimelineService,
    private subService: SubscriptionService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private el: ElementRef) {
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
  }

  ngOnInit(): void {
    this.setStepperOrientation();
  }

  editStepIndex: number = 0;  // Set this to the index of the step you want to show as "editable"

  isStepEditable(index: number): boolean {
    return index === this.editStepIndex;
  }

  changeStepperHeaderEndStepDOM(tradeDidNotHappen: boolean, tradeDidHappen: boolean) {
    if (tradeDidNotHappen) {
      this.step2Icon = 'close';
      this.step2Color = 'white';
      const stepHeaders = this.el.nativeElement.querySelectorAll('.mat-step-header');
      if (stepHeaders && stepHeaders.length > 2) {
        this.renderer.addClass(stepHeaders[2], 'trade-did-not-happen');
      }
    }

    if (tradeDidHappen){
      this.step2Icon = 'check';
      this.step2Color = 'white';
      const stepHeaders = this.el.nativeElement.querySelectorAll('.mat-step-header');
      if (stepHeaders && stepHeaders.length > 2) {
        this.renderer.addClass(stepHeaders[2], 'trade-did-happen');
      }
    }

    if(this.status as number >= TradeStatus.ForSale){
      this.step1Color = 'white';
      const stepHeaders = this.el.nativeElement.querySelectorAll('.mat-step-header');
      if (stepHeaders && stepHeaders.length > 1) {
        this.renderer.addClass(stepHeaders[0], 'trade-did-happen');
      }
    }

    if(this.status as number >= TradeStatus.BuyerCommitted){
      this.step1Color = 'white';
      const stepHeaders = this.el.nativeElement.querySelectorAll('.mat-step-header');
      if (stepHeaders && stepHeaders.length > 1) {
        this.renderer.addClass(stepHeaders[1], 'trade-did-happen');
      }
    }

    if(this.status as number >= TradeStatus.Disputed){
      this.step1Icon = 'priority_high';
      this.step1Color = 'white';
      const stepHeaders = this.el.nativeElement.querySelectorAll('.mat-step-header');
      if (stepHeaders && stepHeaders.length > 1) {
        this.renderer.addClass(stepHeaders[1], 'trade-in-warning');
      }
    }

    this.cdr.detectChanges();
  }

  step2Color: string = 'default';
  step1Color: string = 'default';
  getStepColor(index: number): string {
    if (index === 0) {
      return 'default';
    } else if (index === 1) {
      return this.step1Color;
    } else if (index === 2) {
      return this.step2Color;
    }
    // Add more conditions as needed
    return 'default';
  }

  step1Icon: string = 'check';
  step2Icon: string = 'check';
  getStepIcon(index: number): string {
    if(index === 1){
      return this.step1Icon;
    } else
    if (index === 2) {
      return this.step2Icon;
    }
    return 'check';
  }

  getStepNumber(index: number): number {
    return index + 1;
  }

  setStepperOrientation() {
    if (window.innerWidth < 768) {
      this.stepperOrientation = 'vertical';
    } else {
      this.stepperOrientation = 'horizontal';
    }
    const tradeDidNotHappen = this.status == TradeStatus.SellerCancelled || this.status == TradeStatus.BuyerCancelled || this.status == TradeStatus.SellerCancelledAfterBuyerCommitted || this.status == TradeStatus.Clawbacked;
    const tradeDidHappen = this.status == TradeStatus.Completed || this.status == TradeStatus.Resolved;
    this.changeStepperHeaderEndStepDOM(tradeDidNotHappen, tradeDidHappen);
  }

  async runAfterWeb3Init(): Promise<void> {
    this.hasWeb3 = true;
    await this._validateTradeAddress();
  }

  private async _validateTradeAddress(): Promise<void> {
    this.route.params.subscribe(params => {
      const optionalParam = params['optionalParam'];

      if (optionalParam) {
        // Validate optionalParam here
        console.log('Optional Parameter:', optionalParam);

        // Fetch data from trade address, catch if invalid
        this.web3.callContractMethod('TradeFactory', 'getTradeDetailsByAddress', [optionalParam], 'call').then((item: any) => {
          console.log('Valid trade address');
          this.hasValidTradeAddress = true;
          this.__resolveItemData(item);
        }).catch((err: any) => {
          console.log('Invalid trade address');
          this.hasValidTradeAddress = false;
        });

      } else {
        // Handle case when URL is /trade with nothing behind
        this.hasValidTradeAddress = false;
      }
    });
  }

  private async _validateRoleAndStatus(_item: TradeItem): Promise<void> {
    const userAddress = this.web3.webUser.address!.toLowerCase();
    const buyerAddress = _item.buyer.toLowerCase();
    const sellerAddress = _item.seller.toLowerCase();

    console.log(`item`, _item);

    console.log('User Address:', userAddress);
    console.log('Buyer Address:', buyerAddress);
    console.log('Seller Address:', sellerAddress);

    this.status = parseInt(_item.status) as TradeStatus;
    const isKeeper: boolean = await this.web3.callContractMethod('Keepers', 'isKeeper', [userAddress], 'call');

    if (userAddress == buyerAddress) this.role = TradeRole.BUYER; else
    if (userAddress == sellerAddress) this.role = TradeRole.SELLER; else
    if (isKeeper) this.role = TradeRole.KEEPER; 
    else this.role = TradeRole.ANY;

    const category =
      this.status ==
        TradeStatus.ForSale ? 0 :
        this.status == TradeStatus.Completed ||
          this.status == TradeStatus.Resolved ||
          this.status == TradeStatus.Clawbacked ||
          this.status == TradeStatus.SellerCancelled ||
          this.status == TradeStatus.SellerCancelledAfterBuyerCommitted ||
          this.status == TradeStatus.BuyerCancelled ? 2 : 1;

    console.log(`category`, category);

    if (category >= 1) {
      this.firstFormGroup.get('firstCtrl')!.setValue('valid');
      this.stepper!.next();
    }

    if (category == 2) {
      this.secondFormGroup.get('secondCtrl')!.setValue('valid');
      this.stepper!.next();
    }

    this.editStepIndex = category;

    // this.endStep.label;
    const endStepLabel = this.status == TradeStatus.Completed ? 'Item Sent' : this.status == TradeStatus.Resolved ? 'Resolved' : this.status == TradeStatus.Clawbacked ? 'Clawbacked' : this.status == TradeStatus.SellerCancelled ? 'Seller Cancelled' : this.status == TradeStatus.BuyerCancelled ? 'Buyer Cancelled' : this.status == TradeStatus.SellerCancelledAfterBuyerCommitted ? 'Seller Rejected' : 'Item Sent';
    this.endStep.label = endStepLabel;
    

    if(this.status == TradeStatus.Disputed){
      this.midStep.label = 'Trade Disputed';
    }

    const tradeDidNotHappen = this.status == TradeStatus.SellerCancelled || this.status == TradeStatus.BuyerCancelled || this.status == TradeStatus.SellerCancelledAfterBuyerCommitted || this.status == TradeStatus.Clawbacked;
    const tradeDidHappen = this.status == TradeStatus.Completed || this.status == TradeStatus.Resolved;

    
    this.changeStepperHeaderEndStepDOM(tradeDidNotHappen, tradeDidHappen);

    console.log("formGroupValid?", this.firstFormGroup.valid, this.secondFormGroup.valid, this.thirdFormGroup.valid);


    //this.thirdFormGroup.get('thirdCtrl')!.setValue('valid');

    //this.stepper!.selectedIndex = category;


    this.subService.addSubscription([_item.contractAddress], (event: any) => {
      console.log('event subService', event);
      const status = event[1];
      this.status = parseInt(status) as TradeStatus;
      this.timelineService.addStatus(this.status);
      //
      const category =
        this.status ==
          TradeStatus.ForSale ? 0 :
          this.status == TradeStatus.Completed ||
            this.status == TradeStatus.Resolved ||
            this.status == TradeStatus.Clawbacked ||
            this.status == TradeStatus.SellerCancelled ||
            this.status == TradeStatus.SellerCancelledAfterBuyerCommitted ||
            this.status == TradeStatus.BuyerCancelled ? 2 : 1;

      if (category >= 1) {
        this.firstFormGroup.get('firstCtrl')!.setValue('valid');
        this.editStepIndex = 1;
        this.stepper!.next();
      }

      if (category == 2) {
        this.secondFormGroup.get('secondCtrl')!.setValue('valid');
        this.editStepIndex = 2;
        this.stepper!.next();
      }

      this.editStepIndex = category;

      if(this.status == TradeStatus.Disputed){
        this.midStep.label = 'Trade Disputed';
      }

      const tradeDidNotHappen = this.status == TradeStatus.SellerCancelled || this.status == TradeStatus.BuyerCancelled || this.status == TradeStatus.SellerCancelledAfterBuyerCommitted || this.status == TradeStatus.Clawbacked;
      const tradeDidHappen = this.status == TradeStatus.Completed || this.status == TradeStatus.Resolved;
  
      this.changeStepperHeaderEndStepDOM(tradeDidNotHappen, tradeDidHappen);

    }, 'TradeComponent');
  }

  public statusToString(_status: TradeStatus): string {
    const statusMap: { [key in TradeStatus]: string } = {
      [TradeStatus.ForSale]: 'For Sale',
      [TradeStatus.SellerCancelled]: 'Seller Cancelled',
      [TradeStatus.BuyerCommitted]: 'Buyer Committed, the seller has not yet accepted the trade.',
      [TradeStatus.BuyerCancelled]: 'Buyer Cancelled',
      [TradeStatus.SellerCommitted]: 'Seller Committed, awaiting item delivery.',
      [TradeStatus.SellerCancelledAfterBuyerCommitted]: 'Seller rejected the trade.',
      [TradeStatus.Completed]: 'Completed',
      [TradeStatus.Disputed]: 'Disputed',
      [TradeStatus.Resolved]: 'Resolved',
      [TradeStatus.Clawbacked]: 'Clawbacked',
      [TradeStatus.ANY]: ''
    };

    return statusMap[_status] ?? 'Unknown';
  }

  private async __resolveItemData(_item: TradeItem): Promise<void> {
    const [hasReferral, referralInfo] = await this.referralService.hasReferralCodeLocalOrChain();
    const discountRatio = parseInt(referralInfo?.buyerRatio ?? '0');
    this.referralInfo = { ...referralInfo, discountRatio: discountRatio, hasReferral: hasReferral };

    const ETHUSD = await this.web3.getEthPrice();
    const netValues = this.web3.calculateNetValue(_item.weiPrice, hasReferral, this.web3.webUser.baseFee, discountRatio);
    const decimals = _item.priceType == 1 || _item.priceType == 2 ? 6 : 18;
    const etherPrice = decimals == 6 ? this.web3.fromSmallestUnitToSixthDecimalBaseUnit(netValues.buyerNetPrice) : this.web3.fromWei(netValues.buyerNetPrice, 'ether');
    const priceInUSD = decimals == 6 ? parseFloat(etherPrice) : ETHUSD * parseFloat(etherPrice);

    const floatValues = this.___resolveFloatValues(_item.skinInfo);


    this.item = {
      ..._item,
      buyerShort: this.___getTrimmedAddress(_item.buyer),
      sellerShort: this.___getTrimmedAddress(_item.seller),
      skinInfo: {
        floatValues: floatValues,
        paintSeed: _item.skinInfo.paintSeed,
        paintIndex: _item.skinInfo.paintIndex
      },
      float: {
        min: floatValues[1],
        max: floatValues[0],
        value: floatValues[2]
      },
      indexInfo: {
        etherPrice: etherPrice,
        priceInUSD: priceInUSD,
      },

    };
    console.log('Itemss:', this.item);

    await this._validateRoleAndStatus(this.item);
  }

  private ___getTrimmedAddress(address: string) {
    if (!address) return '';
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
  }

  private ___resolveFloatValues(skinInfo: any): number[] {
    const floatValues = skinInfo.floatValues;
    const paintSeed = skinInfo.paintSeed;
    const paintIndex = skinInfo.paintIndex;
    const floatValuesArray = JSON.parse(floatValues);
    return floatValuesArray;
  }

  openBuyDialog(_item: TradeItem): void {
    let dialogRef = this.dialog.open(BuyDialog, {
      data: _item,
    });

    //this.timelineService.addStatus(TradeStatus.BuyerCommitted);

    dialogRef.componentInstance.dialogData.subscribe((data: any) => {
      console.log(`data`, data);
      if (data.bought) {
        // this.timelineService.addStatus(TradeStatus.BuyerCommitted);
        // this.status = TradeStatus.BuyerCommitted;
        // this.firstFormGroup.get('firstCtrl')!.setValue('valid');
        // this.stepper!.selectedIndex = 1;
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result`, result);
    });
  }

  private __getRoleString(role: TradeRole | string): string {
    switch (role.toString()) {
      case '0':
        return 'Buyer' || TradeRole.BUYER;
      case '1':
        return 'Seller' || TradeRole.SELLER;
      default:
        return 'ERROR';
    }
  }
  convertTradeItemToMyTradeItem(_item: TradeItem): MyTradeItem {
    const role = this.role;
    const item = { contractAddress: _item.contractAddress, index: undefined, role: role, status: _item.status };

    const [max, min, value] = _item.skinInfo.floatValues;

    const details = {
      ..._item,
      uiInfo: {
        ...item,
        status: this.statusToString(item.status as TradeStatus),
        role: this.__getRoleString(item.role),
      },
      float: { max: max, min: min, value: value }
    } as unknown as MyTradeItem;

    return details;
  }

  ngOnDestroy(): void {
    this.web3AccSub?.unsubscribe();
    this.subService.unsubscribe([this.item.contractAddress], 'TradeComponent');
  }

  parseInt(_int: string): number {
    return parseInt(_int);
  }
}

interface TradeItem {
  assetId: string;
  averageSellerDeliveryTime: string;
  buyer: string;
  buyerShort: string;
  buyerTradeUrl: string[] | { partner: string, token: string };
  contractAddress: string;
  inspectLink: string;
  itemImageUrl: string;
  itemMarketName: string;
  priceType: number;
  seller: string;
  sellerShort: string;
  sellerTradeUrl: string[] | { partner: string, token: string };
  skinInfo: { floatValues: number[], paintSeed: string, paintIndex: string };
  float: { min: number, max: number, value: number };
  status: string;
  stickers: any[]; // specify a type if known
  weaponType: string;
  weiPrice: string;
  indexInfo: { etherPrice: string, priceInUSD: number };
}

enum TradeRole {
  BUYER,
  SELLER,
  KEEPER,
  ANY = 'ANY'
}

enum TradeStatus {
  ForSale,
  SellerCancelled,
  BuyerCommitted,
  BuyerCancelled,
  SellerCommitted,
  SellerCancelledAfterBuyerCommitted,
  Completed,
  Disputed,
  Resolved,
  Clawbacked,
  ANY = 'ANY'
}