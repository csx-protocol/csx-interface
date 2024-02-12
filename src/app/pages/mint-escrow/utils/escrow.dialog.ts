import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "src/app/shared/notification.service";
import { Web3Service } from "src/app/shared/web3.service";
import { environment } from "../../../../environments/environment";

@Component({
    selector: 'escrow-dialog',
    templateUrl: './escrow.dialog.html',
    styleUrls: ['./escrow.dialog.scss'],
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
export class EscrowDialog {
    tokenAmountForm: FormGroup = new FormGroup({});
    state = 'in'; // for animation
    maxValue: number = 0;

    constructor(
        public dialogRef: MatDialogRef<EscrowDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private web3: Web3Service,
        private notify: NotificationService,
    ) {
        this.maxValue = parseFloat(this.web3.webUser.balances!['CSX'].balanceEth);
        this.tokenAmountForm = new FormGroup({
            tokenAmount: new FormControl(null, [
                Validators.required,
                Validators.min(0.000000000000000001),
                Validators.max(this.maxValue),
            ]),
        });
        this.tokenAmountForm.get('tokenAmount')?.setValue(0);
    }

    isApproving: boolean = false;
    submitEscrow() {
        if (this.tokenAmountForm.valid == false) {
            return this.notify.notify('error', 'Invalid amount');
        }

        const tokenValue = this.tokenAmountForm.get('tokenAmount')?.value;
        const tokenValueInWeiString = this.web3.csxInstance.web3.utils.toWei(tokenValue.toString(), 'ether');

        this.web3.callContractMethod('CSXToken', 'allowance', [this.web3.webUser.address!, this.web3.contracts['EscrowedCSX'].options.address], 'call').then((allowance) => {
            console.log('allowance', allowance);
            console.log('tokenValue', tokenValueInWeiString);

            const allowanceBN = new this.web3.csxInstance.web3.utils.BN(allowance);
            const tokenValueInWeiBN = new this.web3.csxInstance.web3.utils.BN(tokenValueInWeiString);

            if (allowanceBN.lt(tokenValueInWeiBN)) {
                this.isApproving = true;
                this.web3.approve('CSX', environment.CONTRACTS.EscrowedCSX.address, tokenValueInWeiString).then(() => {
                    this.isApproving = false;
                    this._escrowCSX(tokenValueInWeiString);
                }).catch((error) => {
                    this.notify.openSnackBar(error.message, 'OK');
                    this.isApproving = false;
                });
            } else if (allowanceBN.gte(tokenValueInWeiBN)) {
                this._escrowCSX(tokenValueInWeiString);
            }
        }).catch(() => {
            console.log('checking allowance failed');
        });
    }

    setMaxValue() {
        this.tokenAmountForm.get('tokenAmount')?.setValue(this.maxValue);
    }

    isEscrowing: boolean = false;
    _escrowCSX(_value: string) {
        this.isEscrowing = true;
        //this.web3.mintEscrow(_value).then(() => {

        this.web3.callContractMethod('EscrowedCSX', 'mintEscrow', [_value], 'send').then((result) => {
            console.log('escrowed successfully');
            const _valueInEther = this.web3.csxInstance.web3.utils.fromWei(_value, 'ether');
            this.web3.decreaseBalance('CSX', _valueInEther);
            this.web3.increaseBalance('eCSX', _valueInEther);
            this.maxValue = parseFloat(this.web3.webUser.balances!['CSX'].balanceEth);
            this.tokenAmountForm.controls['tokenAmount'].updateValueAndValidity();
            this.isEscrowing = false;
            this.notify.notify('Escrowed successfully 🫡');
            this.dialogRef.close();
        }
        ).catch((error) => {
            console.log('escrowing failed');
            this.notify.openSnackBar(error.message, 'OK');
            this.isEscrowing = false;
        });
    }
}