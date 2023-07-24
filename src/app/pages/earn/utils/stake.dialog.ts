import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Web3Service } from "../../../shared/web3.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { environment } from "../../../../environment/environment";
import { NotificationService } from "../../../shared/notification.service";

enum StakeMode {
    STAKE = 'stake',
    UNSTAKE = 'unstake',
}

enum StakeToken {
    CSX = 'CSX',
    eCSX = 'eCSX',
}

@Component({
    selector: 'stake-dialog',
    templateUrl: './stake.dialog.html',
    styleUrls: ['./stake.dialog.scss'],
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
export class StakeDialog {
    tokenAmountForm: FormGroup = new FormGroup({});
    state = 'in'; // for animation
    maxValue: number = 0;
    mode: StakeMode = StakeMode.STAKE;
    type: StakeToken = StakeToken.CSX;
    constructor(
        public dialogRef: MatDialogRef<StakeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private web3: Web3Service,
        private notify: NotificationService,
    ) {
        this.mode = data[0];
        this.type = data[1];
        if (this.mode == StakeMode.STAKE) {
            this.maxValue = this.type == StakeToken.CSX ? parseInt(this.web3.webUser.balances!['CSX'].balanceEth) : parseInt(this.web3.webUser.balances!['eCSX'].balanceEth);
            this.tokenAmountForm = new FormGroup({
                tokenAmount: new FormControl(null, [
                    Validators.required,
                    Validators.min(0.000000000000000001),
                    Validators.max(this.maxValue),
                ]),
            });
            this.tokenAmountForm.get('tokenAmount')?.setValue(0);
        } else if (this.mode == StakeMode.UNSTAKE) {
            this.maxValue = this.type == StakeToken.CSX ? parseInt(this.web3.webUser.balances!['sCSX'].balanceEth) : parseInt(this.web3.webUser.balances!['vCSX'].balanceEth);
            this.tokenAmountForm = new FormGroup({
                tokenAmount: new FormControl(null, [
                    Validators.required,
                    Validators.min(0.000000000000000001),
                    Validators.max(this.maxValue),
                ]),
            });
            this.tokenAmountForm.get('tokenAmount')?.setValue(0);
        }
    }

    // onNoClick(): void {
    //     this.dialogRef.close();
    // }

    setMaxValue() {
        this.tokenAmountForm.get('tokenAmount')?.setValue(this.maxValue);
    }

    isApproving: boolean = false;
    isStaking: boolean = false;
    submitStake() {
        if (this.tokenAmountForm.valid) {
            const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;
            
            const tokenValueInWeiString = this.web3.csxInstance.window.web3.utils.toWei(tokenValue.toString(), 'ether');
            const coinType = this.type == StakeToken.CSX ? 'CSX' : 'eCSX';

            this.web3.allowance(coinType, this.web3.webUser.address!, environment.CONTRACTS.StakedCSX.address).then((allowance) => {
                //this.allowanceCSX = allowance;
                console.log('allowance', allowance);
                console.log('tokenValue', tokenValueInWeiString);

                const allowanceBN = new this.web3.csxInstance.window.web3.utils.BN(allowance);
                const tokenValueInWeiBN = new this.web3.csxInstance.window.web3.utils.BN(tokenValueInWeiString);
                

                if (allowanceBN.lt(tokenValueInWeiBN)) {
                    this.isApproving = true;
                    
                    const tokenAddress = coinType == 'CSX' ? environment.CONTRACTS.StakedCSX.address : environment.CONTRACTS.VestedCSX.address;

                    this.web3.approve(coinType, tokenAddress, tokenValueInWeiString).then(() => {
                        this.isApproving = false;
                        coinType == 'CSX' ? this._stakeCSX(tokenValueInWeiString) : this._vestEscrowedCSX(tokenValueInWeiString);
                    }).catch((error) => {
                        this.notify.openSnackBar(error.message, 'OK');
                        this.isApproving = false;
                    });
                } else if (allowanceBN.gte(tokenValueInWeiBN)) {
                    coinType == 'CSX' ? this._stakeCSX(tokenValueInWeiString) : this._vestEscrowedCSX(tokenValueInWeiString);
                }
            }).catch(() => {
                console.log('checking allowance failed');
            });

        } else {
            console.log("Form is not valid");
        }
    }

    _stakeCSX(_value: string) {
        this.isStaking = true;
        this.web3.stake(_value).then(() => {
            console.log('stake success');
            const _valueInEther = this.web3.csxInstance.window.web3.utils.fromWei(_value, 'ether');
            this.web3.decreaseBalance('CSX', _valueInEther);
            this.web3.increaseBalance('sCSX', _valueInEther);
            this.maxValue = parseInt(this.web3.webUser.balances!['CSX'].balanceEth);
            this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
            this.isStaking = false;
            this.notify.openSnackBar('Stake success 🫡', 'OK');
            this.dialogRef.close(['CSX_STAKED', true]);
        }
        ).catch((error) => {
            console.log('stake failed');
            this.notify.openSnackBar(error.message, 'OK');
            this.isStaking = false;
        });
    }

    _vestEscrowedCSX(_value: string) {
        this.isStaking = true;
        this.web3.vest(_value).then(() => {
            console.log('vest success');
            const _valueInEther = this.web3.csxInstance.window.web3.utils.fromWei(_value, 'ether');
            this.web3.decreaseBalance('eCSX', _valueInEther);
            this.web3.increaseBalance('vCSX', _valueInEther);
            this.maxValue = parseInt(this.web3.webUser.balances!['eCSX'].balanceEth);
            this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
            this.isStaking = false;
            this.notify.openSnackBar('Vest success 🫡', 'OK');
            this.dialogRef.close(['eCSX_VESTED', true]);
        }).catch((error) => {
            console.log('vest failed');
            this.notify.openSnackBar(error.message, 'OK');
            this.isStaking = false;
        });
    }

    isUnstaking: boolean = false;
    submitUnstake() {
        if (this.tokenAmountForm.valid) {
            // this.isUnstaking = true;
            const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;
            const tokenValueInWei = this.web3.csxInstance.window.web3.utils.toWei(tokenValue.toString(), 'ether');
            const coinType = this.type == StakeToken.CSX ? 'CSX' : 'eCSX';

            coinType == 'CSX' ? this._unstakeCSX(tokenValueInWei) : this._unvestEscrowedCSXCheck(tokenValueInWei);            
        }
    }

    _unstakeCSX(_tokenValueInWei: string){
        this.web3.unstake(_tokenValueInWei).then(() => {
            console.log('unstake success');
            const _valueInEther = this.web3.csxInstance.window.web3.utils.fromWei(_tokenValueInWei, 'ether');
            this.web3.decreaseBalance('sCSX', _valueInEther);
            this.web3.increaseBalance('CSX', _valueInEther);
            this.maxValue = parseInt(this.web3.webUser.balances!['sCSX'].balanceEth);
            this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
            this.isUnstaking = false;
            this.notify.openSnackBar('Unstake success', 'OK');
            this.dialogRef.close(['CSX_UNSTAKED', true]);
        }).catch((error) => {
            console.log('unstake failed');
            this.notify.openSnackBar(error.message, 'OK');
            this.isUnstaking = false;
        });
    }

    _unvestEscrowedCSXCheck(_tokenValueInWei: string){
        const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;
        const tokenValueInWeiString = this.web3.csxInstance.window.web3.utils.toWei(tokenValue.toString(), 'ether');
        const tokenAddress = this.data[2];

        this.web3.allowance('vCSX', this.web3.webUser.address!, tokenAddress).then((allowance) => {
            console.log('allowance', allowance);
            console.log('tokenValue', tokenValueInWeiString);

            const allowanceBN = new this.web3.csxInstance.window.web3.utils.BN(allowance);
            const tokenValueInWeiBN = new this.web3.csxInstance.window.web3.utils.BN(tokenValueInWeiString);

            if (allowanceBN.lt(tokenValueInWeiBN)) {
                this.isApproving = true;

                this.web3.approve('vCSX', tokenAddress, tokenValueInWeiString).then(() => {
                    this.isApproving = false;
                    this._unvestEscrowedCSXConfirm(_tokenValueInWei);
                }).catch((error) => {
                    this.notify.openSnackBar(error.message, 'OK');
                    this.isApproving = false;
                });
            } else if (allowanceBN.gte(tokenValueInWeiBN)) {
                this._unvestEscrowedCSXConfirm(_tokenValueInWei);
            }

        });

        
    }

    _unvestEscrowedCSXConfirm(_tokenValueInWei: string){
        this.isUnstaking = true;
        this.web3.unvest(this.data[2], _tokenValueInWei).then(() => {
            console.log('unvest success');
            const _valueInEther = this.web3.csxInstance.window.web3.utils.fromWei(_tokenValueInWei, 'ether');
            this.web3.decreaseBalance('vCSX', _valueInEther);
            this.web3.increaseBalance('CSX', _valueInEther);
            this.maxValue = parseInt(this.web3.webUser.balances!['vCSX'].balanceEth);
            this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
            this.isUnstaking = false;
            this.notify.openSnackBar('Unvest success', 'OK');
            this.dialogRef.close(['eCSX_UNVESTED', true]);
        }).catch((error) => {
            console.log('unvest failed');
            this.notify.openSnackBar(error.message, 'OK');
            this.isUnstaking = false;
        });
    }

}
