import { Component, OnDestroy, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Web3Service } from '../../shared/web3.service';
import { NotificationService } from '../../shared/notification.service';

import { StakeDialog } from './utils/stake/stake.dialog';
import Web3 from 'web3';
import { ClaimDialog } from './utils/claim/claim.dialog';
import { IntervalService } from '../../components/my-trades/dialogs/interval.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface StakeInfo {
  usdc: amount;
  usdt: amount;
  weth: amount;
}

interface amount {
  wei: string;
  ether: string;
  etherPlain: string;
}


@Component({
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss'],
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
export class EarnComponent implements OnDestroy {
  web3AccSub?: Subscription;

  stakeInfo: StakeInfo = {
    usdc: {
      wei: '0',
      ether: '0',
      etherPlain: '0'
    },
    usdt: {
      wei: '0',
      ether: '0',
      etherPlain: '0'
    },
    weth: {
      wei: '0',
      ether: '0',
      etherPlain: '0'
    },
  };

  vestInfo: StakeInfo = {
    usdc: {
      wei: '0',
      ether: '0',
      etherPlain: '0'
    },
    usdt: {
      wei: '0',
      ether: '0',
      etherPlain: '0'
    },
    weth: {
      wei: '0',
      ether: '0',
      etherPlain: '0'
    },
  };


  constructor(
    public web3: Web3Service,
    private notify: NotificationService,
    private dialog: MatDialog,
    private intervalService: IntervalService
  ) {
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if (this.web3.webUser.address) {
      this.runAfterWeb3Init();
    }
  }

  canWithdrawVestedStake: boolean = false;
  hasVestingStarted: boolean = false;
  runAfterWeb3Init() {
    //this.web3.getClaimableAmount().then((res) => {

    this.web3.callContractMethod('StakedCSX', 'rewardOf', [this.web3.webUser.address], 'call').then((res) => {
      this.stakeInfo.weth.wei = res.wethAmount;
      this.stakeInfo.usdc.wei = res.usdcAmount;
      this.stakeInfo.usdt.wei = res.usdtAmount;

      this.stakeInfo.weth.etherPlain = parseFloat(this.web3.fromWei(res.wethAmount, 'ether')).toString();
      this.stakeInfo.weth.ether = parseFloat(this.stakeInfo.weth.etherPlain).toFixed(4);

      const decimals = 6;
      const tenPowerDecimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals));

      const usdcBalanceBN = Web3.utils.toBN(this.stakeInfo.usdc.wei);
      const usdcBalanceInteger = usdcBalanceBN.div(tenPowerDecimals).toString(10);
      const usdcBalanceFraction = usdcBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
      this.stakeInfo.usdc.etherPlain = parseFloat(`${usdcBalanceInteger}.${usdcBalanceFraction}`).toString();
      this.stakeInfo.usdc.ether = parseFloat(this.stakeInfo.usdc.etherPlain).toFixed(2);

      const usdtBalanceBN = Web3.utils.toBN(this.stakeInfo.usdt.wei);
      const usdtBalanceInteger = usdtBalanceBN.div(tenPowerDecimals).toString(10);
      const usdtBalanceFraction = usdtBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
      this.stakeInfo.usdt.etherPlain = parseFloat(`${usdtBalanceInteger}.${usdtBalanceFraction}`).toString();
      this.stakeInfo.usdt.ether = parseFloat(this.stakeInfo.usdt.etherPlain).toFixed(2);
    });

    if (
      this.web3.webUser.balances!['eCSX'].balanceEth != '0.0000' ||
      this.web3.webUser.balances!['vCSX'].balanceEth != '0.0000'
    ) {
      this._getVestedClaimableAmountAndTimeStart();
    }
  }

  submitStake() {
    const csxWeiBalance = this.web3.webUser.balances!['CSX'].balanceWei;
    if (csxWeiBalance == '0') {
      this.notify.openSnackBar('You have no CSX to stake 😭', 'OK');
      return;
    }
    this.openStakeDialog(['stake', 'CSX']);
  }

  submitVest() {
    const csxWeiBalance = this.web3.webUser.balances!['eCSX'].balanceWei;
    if (csxWeiBalance == '0') {
      this.notify.openSnackBar('You have no eCSX to vest 😭', 'OK');
      return;
    }
    this.openStakeDialog(['stake', 'eCSX']);
  }

  submitUnstake() {
    const sCsxWeiBalance = this.web3.webUser.balances!['sCSX'].balanceWei;
    if (sCsxWeiBalance == '0') {
      this.notify.openSnackBar('You have no sCSX balance to unstake 🤔', 'OK');
      return;
    }
    this.openStakeDialog(['unStake', 'CSX']);
  }

  submitWithdrawVestedStake() {
    const vCsxWeiBalance = this.web3.webUser.balances!['vCSX'].balanceWei;

    if (vCsxWeiBalance == '0') {
      this.notify.openSnackBar('You have no vCSX balance to withdraw 🤔', 'OK');
      return;
    }
    this.openStakeDialog(['unStake', 'vCSX', this.vestAddress]);
  }

  submitClaim() {
    this.openClaimDialog(['claim', 'CSX',
      [
        this.stakeInfo.usdc.etherPlain,
        this.stakeInfo.usdt.etherPlain,
        this.stakeInfo.weth.etherPlain
      ]
    ]);
  }

  addCommas(num: number | string): string {
    const [integerPart, decimalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  openStakeDialog(_data: any): void {

    console.log('SENDING DATA TO DIALOG: ', _data);

    const dialogRef = this.dialog.open(StakeDialog, {
      data: _data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (!result) {
        return;
      }

      if (result[0] == 'eCSX_STAKED' && result[1] == true) {
        this._getVestedClaimableAmountAndTimeStart();
      }
    });
  }

  openClaimDialog(_data: any): void {
    const dialogRef = this.dialog.open(ClaimDialog, {
      data: _data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if (!result) {
        return;
      }

      const currencies = ['usdc', 'usdt', 'weth'] as const;
      const decimalPlaces = [2, 2, 4];

      for (let i = 0; i < result.length; i++) {
        if (result[i]) {
          let currency = currencies[i];
          if (currency != undefined) {
            this.stakeInfo[currency].etherPlain = '0';
            this.stakeInfo[currency].ether = parseFloat(this.stakeInfo[currency].etherPlain).toFixed(decimalPlaces[i]);
          }
        }
      }
    });

  }

  vestTimeStart: number = 0;
  // transform(value: number): string {
  //   let result = '';

  //   const seconds = value % 60;
  //   const minutes = Math.floor((value / 60) % 60);
  //   const hours = Math.floor((value / (60 * 60)) % 24);
  //   const days = Math.floor(value / (60 * 60 * 24));

  //   result += days ? `${days} days ` : '';
  //   result += hours ? `${hours} hours ` : '';
  //   result += minutes ? `${minutes} minutes ` : '';
  //   result += seconds ? `${seconds} seconds ` : '';

  //   return result.trim();
  // }

  vestAddress: string = '';
  _getVestedClaimableAmountAndTimeStart() {

    this.web3.callContractMethod(
      'VestedCSX',
      'getVestedStakingContractAddress',
      [this.web3.webUser.address],
      'call'
    ).then((vestAddress) => {
      if (vestAddress == '0x0000000000000000000000000000000000000000') {
        return;
      }

      this.hasVestingStarted = true;

      this.vestAddress = vestAddress;

      this.web3.callContractMethod('VestedStaking', 'getClaimableAmountAndVestTimeStart', [vestAddress], 'call').then((resValues) => {
        this.vestInfo.weth.wei = resValues.wethAmount;
        this.vestInfo.usdc.wei = resValues.usdcAmount;
        this.vestInfo.usdt.wei = resValues.usdtAmount;

        this.vestInfo.weth.ether = parseFloat(this.web3.fromWei(resValues.wethAmount, 'ether')).toFixed(4);

        const decimals = 6;
        const tenPowerDecimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals));

        const usdcBalanceBN = Web3.utils.toBN(this.vestInfo.usdc.wei);
        const usdcBalanceInteger = usdcBalanceBN.div(tenPowerDecimals).toString(10);
        const usdcBalanceFraction = usdcBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
        this.vestInfo.usdc.ether = parseFloat(`${usdcBalanceInteger}.${usdcBalanceFraction}`).toFixed(2);

        const usdtBalanceBN = Web3.utils.toBN(this.vestInfo.usdt.wei);
        const usdtBalanceInteger = usdtBalanceBN.div(tenPowerDecimals).toString(10);
        const usdtBalanceFraction = usdtBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
        this.vestInfo.usdt.ether = parseFloat(`${usdtBalanceInteger}.${usdtBalanceFraction}`).toFixed(2);

        const vestTimeStart = resValues.vestTimeStart;
        this.vestTimeStart = parseInt(vestTimeStart);
        this.validation();
      });
    });
  }

  ngOnDestroy(): void {
    this.web3AccSub?.unsubscribe();
    this.intervalService.stopInterval('vestInterval');
  }

  /**
   * Interactive Progress Bar
   */
  isLoading: boolean = true;
  progressBarValue: number = 0;
  timeIntervalInMilliseconds: number = 24 * 60 * 60 * 1000;//5 * 60 * 1000; 

  // Validation
  private validation() {
    console.log('this.vestTimeStart: ', this.vestTimeStart);
    
    const [hasIntervalPassed, timeLeft, progress] = this.hasTimeIntervalPassedSinceVestStart();
    
    console.log('hasTimeIntervalPassedSinceVestStart: ', hasIntervalPassed);
    console.log('timeLeft: ', timeLeft);
    console.log('progress: ', progress);

    this.progressBarValue = Math.min(Math.max(progress, 0), 100); // Ensure progress stays between 0 and 100
    this.isLoading = false; // Assuming you want to set this here
  }


  getUIMode(_isLoading: boolean) {
    // return 'query' or 'determinate'.
    return _isLoading ? 'query' : 'determinate';
  }

  hasTimeIntervalPassedSinceVestStart(): [boolean, number, number] {
    const vestStartTime = this.vestTimeStart;
    const currentTime = new Date().getTime();
    const vestTimePlusTimeInterval = vestStartTime + this.timeIntervalInMilliseconds;
    
    const hasTimeIntervalPassed = currentTime >= vestTimePlusTimeInterval;

    const timeLeft = hasTimeIntervalPassed ? 0 : vestTimePlusTimeInterval - currentTime;

    // Calculate progress percentage
    const progress = (currentTime - vestStartTime) / this.timeIntervalInMilliseconds * 100;

    return [hasTimeIntervalPassed, timeLeft, progress];
}


  //   if (vestTimeLeft == 0) {
  //     this.hasTimeIntervalPassed = true;
  //     return;
  //   }

  //   const interval = setInterval(() => {
  //     this.vestTimeLeft--;
  //     if (this.vestTimeLeft == 0) {
  //       this.hasTimeIntervalPassed = true;
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // }
}
