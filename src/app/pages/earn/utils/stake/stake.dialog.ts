import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Web3Service } from "../../../../shared/web3.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../../../../shared/notification.service";

enum StakeMode {
    STAKE = 'stake',
    UNSTAKE = 'unStake',
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
            //this.tokenAmountForm.get('tokenAmount')?.setValue(0);
        }
    }

    setMaxValue() {
        this.tokenAmountForm.get('tokenAmount')?.setValue(this.maxValue);
    }

    isApproving: boolean = false;
    isStaking: boolean = false;
    txInfo: {
        name: string,
        method: string,
        params: any[],
        txType: 'call' | 'send',
        fromAddress?: string
    } = {
            name: "",
            method: "",
            params: [],
            txType: "call"
        };
    submitStake() {
        if (this.tokenAmountForm.valid) {
            const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;

            const tokenValueInWeiString = this.web3.toWei(tokenValue.toString(), 'ether');
            const coinType = this.type == StakeToken.CSX ? 'CSX' : 'eCSX';

            console.log('DATA', this.data);
            

            this.txInfo = {
                name: coinType == 'CSX' ? 'StakedCSX' : 'VestedCSX',
                method: coinType == 'CSX' ? 'stake' : 'vest',
                params: [tokenValueInWeiString],
                txType: 'send',
                fromAddress: this.web3.webUser.address!,
            };

            console.log('TXINFO', this.txInfo);
            

            this.isApproving = true;

        } else {
            console.log("Form is not valid");
        }
    }

    // _stakeCSX(_value: string) {
    //     this.isStaking = true;
    //     this.web3.stake(_value).then(() => {
    //         console.log('stake success');
    //         const _valueInEther = this.web3.fromWei(_value, 'ether');
    //         this.web3.decreaseBalance('CSX', _valueInEther);
    //         this.web3.increaseBalance('sCSX', _valueInEther);
    //         this.maxValue = parseInt(this.web3.webUser.balances!['CSX'].balanceEth);
    //         this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
    //         this.isStaking = false;
    //         this.notify.openSnackBar('Stake success 🫡', 'OK');
    //         this.dialogRef.close(['CSX_STAKED', true]);
    //     }
    //     ).catch((error) => {
    //         console.log('stake failed');
    //         this.notify.openSnackBar(error.message, 'OK');
    //         this.isStaking = false;
    //     });
    // }

    // _vestEscrowedCSX(_value: string) {
    //     this.isStaking = true;
    //     //this.web3.vest(_value).then(() => {
    //     this.web3.callContractMethod('VestedCSX', 'vest', [_value], 'send').then(() => {
    //         console.log('vest success');
    //         const _valueInEther = this.web3.fromWei(_value, 'ether');
    //         this.web3.decreaseBalance('eCSX', _valueInEther);
    //         this.web3.increaseBalance('vCSX', _valueInEther);
    //         this.maxValue = parseInt(this.web3.webUser.balances!['eCSX'].balanceEth);
    //         this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
    //         this.isStaking = false;
    //         this.notify.openSnackBar('Vest success 🫡', 'OK');
    //         this.dialogRef.close(['eCSX_VESTED', true]);
    //     }).catch((error) => {
    //         console.log('vest failed');
    //         this.notify.openSnackBar(error.message, 'OK');
    //         this.isStaking = false;
    //     });
    // }

    isUnstaking: boolean = false;
    submitUnstake() {
        if (this.tokenAmountForm.valid) {
            //this.isUnstaking = true;
            const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;
            const tokenValueInWei = this.web3.toWei(tokenValue.toString(), 'ether');
            console.log('THE TYPE', this.type);

            const coinType = this.type == StakeToken.CSX ? 'CSX' : 'eCSX';

            coinType == 'CSX' ? this._unstakeCSX(tokenValueInWei) : this._unvestEscrowedCSXCheck(tokenValueInWei);

            // this.txInfo = {
            //     name: coinType == 'CSX' ? 'StakedCSX' : 'VestedStaking',
            //     method: coinType == 'CSX' ? 'unStake' : 'withdraw',
            //     params: [this.data[2], tokenValueInWei],
            //     txType: 'send',
            // };

            // this.isApproving = true;
        }
    }

    _unstakeCSX(_tokenValueInWei: string) {
        this.web3.callContractMethod('StakedCSX', 'unStake', [_tokenValueInWei], 'send').then(() => {
            console.log('unstake success');
            const _valueInEther = this.web3.fromWei(_tokenValueInWei, 'ether');
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

    _unvestEscrowedCSXCheck(_tokenValueInWei: string) {
        console.log('yooooto');

        const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;

        const tokenValueInWeiString = this.web3.toWei(tokenValue.toString(), 'ether');
        const coinType = this.type == StakeToken.CSX ? 'CSX' : 'eCSX';

        console.log('DATA', this.data);

        const params = [this.data[2], tokenValueInWeiString];

        this.txInfo = {
            name: coinType == 'CSX' ? 'StakedCSX' : 'VestedStaking',
            method: coinType == 'CSX' ? 'unStake' : 'withdraw',
            params: params,
            txType: 'send',
            fromAddress: this.web3.webUser.address!,
        };

        this.isApproving = true;

        // const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;
        // const tokenValueInWeiString = this.web3.toWei(tokenValue.toString(), 'ether');
        // const tokenAddress = this.data[2];

        // this.web3.callContractMethod('VestedCSX', 'allowance', [this.web3.webUser.address!, tokenAddress], 'call').then((allowance) => {
        //     //this.web3.allowance('vCSX', this.web3.webUser.address!, tokenAddress).then((allowance) => {
        //     console.log('allowance', allowance);
        //     console.log('tokenValue', tokenValueInWeiString);

        //     const allowanceBN = this.web3.toBN(allowance);
        //     const tokenValueInWeiBN = this.web3.toBN(tokenValueInWeiString);

        //     if (allowanceBN.lt(tokenValueInWeiBN)) {
        //         this.isApproving = true;

        //         this.web3.approve('vCSX', tokenAddress, tokenValueInWeiString).then(() => {
        //             this.isApproving = false;
        //             this._unvestEscrowedCSXConfirm(_tokenValueInWei);
        //         }).catch((error) => {
        //             this.notify.openSnackBar(error.message, 'OK');
        //             this.isApproving = false;
        //         });
        //     } else if (allowanceBN.gte(tokenValueInWeiBN)) {
        //         this._unvestEscrowedCSXConfirm(_tokenValueInWei);
        //     }

        // });
    }

    _unvestEscrowedCSXConfirm(_tokenValueInWei: string) {
        this.isUnstaking = true;
        this.web3.callContractMethod('VestedStaking', 'withdraw', [this.data[2], _tokenValueInWei], 'send').then(() => {
            console.log('unvest success');
            const _valueInEther = this.web3.fromWei(_tokenValueInWei, 'ether');
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

    onSignStepComplete(_success: boolean) {
        console.log('onSignStepComplete success?', _success);
        console.log(this.txInfo);


        if (_success) {
            this.adjustOutcomes(this.txInfo);
            return this.dialogRef.close([`${this.type}_STAKED`, _success]);
        }

        this.isApproving = false;
    }

    adjustOutcomes(txInfo: any) {
        console.log(txInfo);
        //const params = txInfo.name == 'VestedCSX' ? txInfo.params[0] : txInfo.params[1];  
        const params = txInfo.name == 'VestedStaking' ? txInfo.params[1] : txInfo.params[0];
        let _valueInEther = this.web3.fromWei(params, 'ether');
        let decreaseToken, increaseToken;

        switch (txInfo.name) {
            case 'StakedCSX':
                if (this.mode == StakeMode.STAKE) {
                    decreaseToken = 'CSX';
                    increaseToken = 'sCSX';
                } else if (this.mode == StakeMode.UNSTAKE) {
                    decreaseToken = 'sCSX';
                    increaseToken = 'CSX';
                }
                break;
            case 'VestedCSX':
                if (this.mode == StakeMode.STAKE) {
                    decreaseToken = 'CSX';
                    increaseToken = 'vCSX';
                } else if (this.mode == StakeMode.UNSTAKE) {
                    decreaseToken = 'vCSX';
                    increaseToken = 'CSX';
                }
                break;
            case 'VestedStaking':
                if (this.mode == StakeMode.STAKE) {
                    decreaseToken = 'CSX';
                    increaseToken = 'vCSX';
                } else if (this.mode == StakeMode.UNSTAKE) {
                    decreaseToken = 'vCSX';
                    increaseToken = 'CSX';
                }
                break;
            default:
                console.error('Unknown txInfo.name', txInfo.name);
                break;
        }

        if (decreaseToken && increaseToken) {
            if (parseFloat(this.web3.webUser.balances![decreaseToken].balanceEth) < parseFloat(_valueInEther)) {
                console.error("Insufficient local balance for", decreaseToken);
                console.log('Decreasing balance of', decreaseToken, 'by', _valueInEther);
                console.log('Increasing balance of', increaseToken, 'by', _valueInEther);
                console.log('Current balances:', this.web3.webUser.balances!);
                return;
            }
            this.web3.decreaseBalance(decreaseToken, _valueInEther);
            this.web3.increaseBalance(increaseToken, _valueInEther);
            this.maxValue = parseInt(this.web3.webUser.balances![increaseToken].balanceEth);
        }
    }



    adjustOutcomesOld(txInfo: any) {
        console.log(txInfo);
        let _valueInEther;
        if (txInfo.name == 'StakedCSX' && this.mode == StakeMode.UNSTAKE) {
            _valueInEther = this.web3.fromWei(txInfo.params[0], 'ether');
            this.web3.decreaseBalance('sCSX', _valueInEther);
            this.web3.increaseBalance('CSX', _valueInEther);
        } else if (txInfo.name == 'VestedStaking' && this.mode == StakeMode.UNSTAKE) {
            _valueInEther = this.web3.fromWei(txInfo.params[1], 'ether');
            this.web3.decreaseBalance('vCSX', _valueInEther);
            this.web3.increaseBalance('CSX', _valueInEther);
        } else if (txInfo.name == 'StakedCSX' && this.mode == StakeMode.STAKE) {
            _valueInEther = this.web3.fromWei(txInfo.params[0], 'ether');
            this.web3.decreaseBalance('CSX', _valueInEther);
            this.web3.increaseBalance('sCSX', _valueInEther);
        } else if (txInfo.name == 'VestedStaking' && this.mode == StakeMode.STAKE) {
            _valueInEther = this.web3.fromWei(txInfo.params[1], 'ether');
            this.web3.decreaseBalance('CSX', _valueInEther);
            this.web3.increaseBalance('vCSX', _valueInEther);
        }
    }



    contractName: string = '';
    methodName: string = '';
    methodParams: any[] = [];
    public getFunctionInfo(): Promise<{ name: string; method: string; params: any[]; }> {
        const contractName = this.contractName;
        const method = this.methodName;
        const params: any[] = this.methodParams;
        return Promise.resolve({ name: contractName, method, params });
    }
}
