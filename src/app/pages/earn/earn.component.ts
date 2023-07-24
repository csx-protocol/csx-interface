import { Component, OnDestroy, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Web3Service } from '../../shared/web3.service';
import { NotificationService } from '../../shared/notification.service';

import { StakeDialog } from './utils/stake.dialog';
import Web3 from 'web3';

interface StakeInfo {
  usdc: amount;
  usdt: amount;
  weth: amount;
}

interface amount {
  wei: string;
  ether: string;
}


@Component({
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss']
})
export class EarnComponent implements OnDestroy, PipeTransform  {
  web3AccSub?: Subscription;

  stakeInfo: StakeInfo = {
    usdc: {
      wei: '0',
      ether: '0',
    },
    usdt: {
      wei: '0',
      ether: '0',
    },
    weth: {
      wei: '0',
      ether: '0',
    },
  };

  vestInfo: StakeInfo = {
    usdc: {
      wei: '0',
      ether: '0',
    },
    usdt: {
      wei: '0',
      ether: '0',
    },
    weth: {
      wei: '0',
      ether: '0',
    },
  };


  constructor(
    public web3: Web3Service,
    private notify: NotificationService,
    private dialog: MatDialog,
  ) {
    this.web3AccSub = web3.webUser.afterAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if(this.web3.webUser.address){
      this.runAfterWeb3Init();
    }
  }

  canWithdrawVestedStake: boolean = false;
  runAfterWeb3Init() {    
    this.web3.getClaimableAmount().then((res) => {
      this.stakeInfo.weth.wei = res.wethAmount;
      this.stakeInfo.usdc.wei = res.usdcAmount;
      this.stakeInfo.usdt.wei = res.usdtAmount;

      this.stakeInfo.weth.ether = parseFloat(this.web3.csxInstance.window.web3.utils.fromWei(res.wethAmount, 'ether')).toFixed(4);

      const decimals = 6;
      const tenPowerDecimals = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals));

      const usdcBalanceBN = Web3.utils.toBN(this.stakeInfo.usdc.wei);
      const usdcBalanceInteger = usdcBalanceBN.div(tenPowerDecimals).toString(10);
      const usdcBalanceFraction = usdcBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
      this.stakeInfo.usdc.ether = parseFloat(`${usdcBalanceInteger}.${usdcBalanceFraction}`).toFixed(2);

      const usdtBalanceBN = Web3.utils.toBN(this.stakeInfo.usdt.wei);
      const usdtBalanceInteger = usdtBalanceBN.div(tenPowerDecimals).toString(10);
      const usdtBalanceFraction = usdtBalanceBN.mod(tenPowerDecimals).toString(10).padStart(decimals, '0');
      this.stakeInfo.usdt.ether = parseFloat(`${usdtBalanceInteger}.${usdtBalanceFraction}`).toFixed(2);
    });
    
    if(
      this.web3.webUser.balances!['eCSX'].balanceEth != '0.0000' || 
      this.web3.webUser.balances!['vCSX'].balanceEth != '0.0000'
      ){
      this._getVestedClaimableAmountAndTimeLeft();
    }
  }

  submitStake(){
    const csxWeiBalance = this.web3.webUser.balances!['CSX'].balanceWei;
    if(csxWeiBalance == '0'){
      this.notify.openSnackBar('You have no CSX to stake 😭', 'OK');
      return;
    }
    this.openDialog(['stake', 'CSX']);
  }

  submitVest(){
    const csxWeiBalance = this.web3.webUser.balances!['eCSX'].balanceWei;
    if(csxWeiBalance == '0'){
      this.notify.openSnackBar('You have no eCSX to vest 😭', 'OK');
      return;
    }
    this.openDialog(['stake', 'eCSX']);
  }

  submitUnstake() {
    const sCsxWeiBalance = this.web3.webUser.balances!['sCSX'].balanceWei;
    if (sCsxWeiBalance == '0') {
      this.notify.openSnackBar('You have no vCSX balance to unstake 🤔', 'OK');
        return;
    }
    this.openDialog(['unstake', 'CSX']);
  }

  submitWithdrawVestedStake() {
    const vCsxWeiBalance = this.web3.webUser.balances!['vCSX'].balanceWei;
    
    if (vCsxWeiBalance == '0') {
      this.notify.openSnackBar('You have no vCSX balance to withdraw 🤔', 'OK');
        return;
    }
    this.openDialog(['unstake', 'vCSX', this.vestAddress]);
  }

  submitClaim() {
    const claimableRewards = '0';
    if (claimableRewards == '0') {
      this.notify.openSnackBar('You have no claimable rewards 🤦‍♂️', 'OK');
      return;
    }
  }

  addCommas(num: number | string): string {
    const [integerPart, decimalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }

  openDialog(_data: any): void {   
    const dialogRef = this.dialog.open(StakeDialog, {
      data: _data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

      if(!result){
        return;
      }

      if(result[0] == 'eCSX_VESTED' && result[1] == true){
        this._getVestedClaimableAmountAndTimeLeft();
      }
    });
  }

  vestTimeLeft: number = 0;
  transform(value: number): string {
    let result = '';

    const seconds = value % 60;
    const minutes = Math.floor((value / 60) % 60);
    const hours = Math.floor((value / (60 * 60)) % 24);
    const days = Math.floor(value / (60 * 60 * 24));

    result += days ? `${days} days ` : '';
    result += hours ? `${hours} hours ` : '';
    result += minutes ? `${minutes} minutes ` : '';
    result += seconds ? `${seconds} seconds ` : '';

    return result.trim();
  }

  vestAddress: string = '';
  _getVestedClaimableAmountAndTimeLeft(){
    this.web3.getVestedStakingContractAddress().then((vestAddress) => {        
      if(vestAddress == '0x0000000000000000000000000000000000000000'){
        return;
      }

      this.vestAddress = vestAddress;

      this.web3.getClaimableVestedAmountAndVestTimeLeft(vestAddress).then((resValues) => {
        this.vestInfo.weth.wei = resValues.wethAmount;
        this.vestInfo.usdc.wei = resValues.usdcAmount;
        this.vestInfo.usdt.wei = resValues.usdtAmount;
  
        this.vestInfo.weth.ether = parseFloat(this.web3.csxInstance.window.web3.utils.fromWei(resValues.wethAmount, 'ether')).toFixed(4);
  
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

        const vestTimeLeft = resValues.vestTimeLeft;
        this.vestTimeLeft = parseInt(vestTimeLeft);
      });
    });
  }

  ngOnDestroy(): void {
    this.web3AccSub?.unsubscribe();
  }
}
