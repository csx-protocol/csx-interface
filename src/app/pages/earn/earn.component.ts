import { Component, OnDestroy } from '@angular/core';
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
export class EarnComponent implements OnDestroy {
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

  constructor(
    public web3: Web3Service,
    private notify: NotificationService,
    private dialog: MatDialog,
  ) {
    this.web3AccSub = web3.webUser.myAccount$?.subscribe(async (_account: any) => { this.runAfterWeb3Init(); });
    if(this.web3.webUser.address){
      this.runAfterWeb3Init();
    }
  }

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
  }

  submitStake(){
    const csxWeiBalance = this.web3.webUser.balances!['CSX'].balanceWei;
    if(csxWeiBalance == '0'){
      this.notify.openSnackBar('You have no CSX to stake 😭', 'OK');
      return;
    }
    this.openDialog('stake');
  }

  submitUnstake() {
    const sCsxWeiBalance = this.web3.webUser.balances!['sCSX'].balanceWei;
    if (sCsxWeiBalance == '0') {
      this.notify.openSnackBar('You have no sCSX balance to unstake 🤔', 'OK');
        return;
    }
    this.openDialog('unstake');
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
    });
  }

  ngOnDestroy(): void {
    this.web3AccSub?.unsubscribe();
  }
}
