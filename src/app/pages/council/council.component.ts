import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-council',
  templateUrl: './council.component.html',
  styleUrls: ['./council.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave',
        animate(600, style({ opacity: 0 }))
      )
    ])
  ]
})
export class CouncilComponent {
  keepers: string[] = [];
  council = '';
  keeperOracle = '';

  addressForm: FormGroup;

  web3AccSub?: Subscription;
  constructor(public readonly web3: Web3Service) {
    this.addressForm = new FormGroup({
      keepersAddress: new FormControl(null, [
        Validators.required,
      ]),
      councilAddress: new FormControl(null, [
        Validators.required,
      ]),
      keeperOracleAddress: new FormControl(null, [
        Validators.required,
      ]),
    });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
  }

  isCouncil: boolean = false;
  async runAfterWeb3Init(): Promise<void> {
    this.isCouncil = await this.getIsCouncil();
    this.council = await this.getCouncil();
    this.keeperOracle = await this.getKeeperOracle();
    await this.getKeepers();
    await this.getNonDistributedRewards();
  }

  async getKeepers(): Promise<any> {
    const keepersLength: number = await this.web3.callContractMethod('Keepers', 'getKeepersCount', [], 'call');
    const indices = Array.from({ length: keepersLength - 1 }, (_, i) => i + 1);

    const keepers = [];

    for (const index of indices) {
      const keeper = await this.web3.callContractMethod('Keepers', 'keepers', [index], 'call');
      keepers.push(keeper);
    }

    this.keepers = keepers;
  }

  async getIsCouncil(): Promise<boolean> {
    return await this.web3.callContractMethod('Keepers', 'isCouncil', [this.web3.webUser.address], 'call');
  }

  async getCouncil(): Promise<string> {
    return await this.web3.callContractMethod('Keepers', 'council', [], 'call');
  }

  async getKeeperOracle(): Promise<string> {
    return await this.web3.callContractMethod('Keepers', 'keeperOracleAddress', [], 'call');
  }

  isAddingKeeper: boolean = false;
  async addKeeper(_address: string): Promise<void> {
    this.isAddingKeeper = true;
    await this.web3.callContractMethod('Keepers', 'addKeeper', [_address], 'send').then((result) => {
      console.log('result', result);
      this.isAddingKeeper = false;
      this.addressForm.get('keepersAddress')?.setValue('');
      this.keepers.push(_address);
    }).catch((error) => {
      console.log(error);
      this.isAddingKeeper = false;
    });
  }

  isRemovingKeeper: boolean = false;
  async removeKeeper(_address: string): Promise<void> {
    this.isRemovingKeeper = true;
    await this.web3.callContractMethod('Keepers', 'removeKeeper', [_address], 'send').then((result) => {
      console.log('result', result);
      this.isRemovingKeeper = false;
      this.keepers = this.keepers.filter((keeper) => keeper !== _address);
    }).catch((error) => {
      console.log(error);
      this.isRemovingKeeper = false;
    });
  }

  submitAddKeeper() {
    const keepersAddress = this.addressForm.get('keepersAddress')?.value;
    console.log('keepersAddress', keepersAddress);
    this.addKeeper(keepersAddress);
  }

  isCommittedToChangeKeeperOracle: boolean = false;
  committToChangeKeeperOracle() {
    this.isCommittedToChangeKeeperOracle = true;
  }

  isChangingKeeperOracle: boolean = false;
  async changeKeeperOracle(_address: string): Promise<void> {
    this.isChangingKeeperOracle = true;
    await this.web3.callContractMethod('Keepers', 'changeKeeperNode', [_address], 'send').then((result) => {
      console.log('result', result);
      this.isChangingKeeperOracle = false;
      this.keeperOracle = _address;
    }).catch((error) => {
      console.log(error);
      this.isChangingKeeperOracle = false;
    });
  }

  submitChangeKeeperOracle() {
    const keeperOracleAddress = this.addressForm.get('keeperOracleAddress')?.value;
    console.log('keeperOracleAddress', keeperOracleAddress);
    this.changeKeeperOracle(keeperOracleAddress);
  }

  isCommittedToChangeCouncil: boolean = false;
  committToChangeCouncil() {
    this.isCommittedToChangeCouncil = true;
  }

  isChangingCouncil: boolean = false;
  async changeCouncil(_address: string): Promise<void> {
    this.isChangingCouncil = true;
    await this.web3.callContractMethod('Keepers', 'changeCouncil', [_address], 'send').then((result) => {
      console.log('result', result);
      this.isChangingCouncil = false;
      this.council = _address;
    }).catch((error) => {
      console.log(error);
      this.isChangingCouncil = false;
    });
  }

  submitChangeCouncil() {
    const councilAddress = this.addressForm.get('councilAddress')?.value;
    console.log('councilAddress', councilAddress);
    this.changeCouncil(councilAddress);
  }

  isSubmittingDistributeRewards: boolean = false;
  submitDistributeRewards() {
    this.isSubmittingDistributeRewards = true;
    this.web3.callContractMethod('StakedCSX', 'distribute', [true, true, true], 'send').then((result) => {
      this.isSubmittingDistributeRewards = false;
      console.log('result', result);
    }).catch((error) => {
      this.isSubmittingDistributeRewards = false;
      console.log(error);
    });
  }

  nonDistributedRewardsWETHWEI: string = '0';
  nonDistributedRewardsUSDCWEI: string = '0';
  nonDistributedRewardsUSDTWEI: string = '0';
  nonDistributedRewardsWETH: string = '0';
  nonDistributedRewardsUSDC: string = '0';
  nonDistributedRewardsUSDT: string = '0';
  async getNonDistributedRewards() {
    try {
      const nonDistributedRewardsWETH = await this.web3.callContractMethod('StakedCSX', 'nonDistributedRewardsPerToken', [this.web3.contracts['WETH'].options.address], 'call');
      const nonDistributedRewardsUSDC = await this.web3.callContractMethod('StakedCSX', 'nonDistributedRewardsPerToken', [this.web3.contracts['USDC'].options.address], 'call');
      const nonDistributedRewardsUSDT = await this.web3.callContractMethod('StakedCSX', 'nonDistributedRewardsPerToken', [this.web3.contracts['USDT'].options.address], 'call');
      this.nonDistributedRewardsWETHWEI = nonDistributedRewardsWETH;
      this.nonDistributedRewardsUSDCWEI = nonDistributedRewardsUSDC;
      this.nonDistributedRewardsUSDTWEI = nonDistributedRewardsUSDT;

      this.nonDistributedRewardsWETH = this.web3.csxInstance.web3.utils.fromWei(nonDistributedRewardsWETH, 'ether');
      this.nonDistributedRewardsUSDC = this.web3.csxInstance.web3.utils.fromWei(nonDistributedRewardsUSDC, 'mwei');
      this.nonDistributedRewardsUSDT = this.web3.csxInstance.web3.utils.fromWei(nonDistributedRewardsUSDT, 'mwei');
    } catch (error) {
      console.log(error);
    }
  }
}
