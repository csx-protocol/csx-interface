import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Inject, } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Web3Service } from "../../../shared/web3.service";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationService } from "../../../shared/notification.service";

@Component({
    selector: 'weth-dialog',
    templateUrl: './wethConvert.dialog.html',
    styleUrls: ['./wethConvert.dialog.scss'],
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
export class wethConvertDialog {
    swapForm: FormGroup;
    maxValue: number = 0;

    fromName: string = 'WETH';
    fromBalance: number = 0;
    fromImage: string = 'assets/utils/wrapped-eth.png';

    toName: string = 'ETH';
    toBalance: number = 0;
    toImage: string = 'assets/utils/ethereum-eth.png';

    maxValueValidator(maxValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const forbidden = control.value > maxValue;
          return forbidden ? { 'maxValue': { value: control.value } } : null;
        };
      }
      

    constructor(
        /*private dialogRef: MatDialogRef<wethConvertDialog>,*/
        @Inject(MAT_DIALOG_DATA) public data: any,
        private web3: Web3Service,
        private notify: NotificationService,
    ) {
        this.data = data;
        console.log(this.data);

        this.fromBalance = parseFloat(this.web3.webUser.balances!['WETH'].balanceEth);
        this.toBalance = parseFloat(this.web3.webUser.balances!['ETH'].balanceEth);
        this.maxValue = this.fromBalance;
        
        this.swapForm = new FormGroup({
            fromValue: new FormControl(null, [
                Validators.required,
                //Validators.pattern('^[0-9]*$'),
                Validators.min(0.000000000000000001),
                this.maxValueValidator(this.maxValue)
                // Validators.min(0),
            ]),
            toValue: new FormControl(null, [
                // Validators.required,
                // Validators.pattern('^[0-9]*$'),
            ])
        });
        this.swapForm.get('fromValue')?.setValue(0);
        this.swapForm.get('toValue')?.setValue(0);

        this.swapForm.get('fromValue')?.valueChanges.subscribe(value => {
            this.swapForm.get('toValue')?.setValue(value, { emitEvent: false });
          });
        
        console.log('this.swapForm', this.swapForm);
    }

    getBalanceMap(): {[key: string]: string} {
        return {
            'WETH': this.web3.webUser.balances!['WETH'].balanceEth,
            'ETH': this.web3.webUser.balances!['ETH'].balanceEth
        };
    }

    toggleDirection() {
        // Define a mapping for easier lookup
        const balanceMap = this.getBalanceMap();
        
        // Swap the fromName and toName
        [this.fromName, this.toName, this.toImage] = [this.toName, this.fromName, this.fromImage];
        
        // Update the balances according to the new fromName and toName
        this.fromBalance = parseFloat(balanceMap[this.fromName]);
        this.toBalance = parseFloat(balanceMap[this.toName]);
    
        // Update the max value and validate the form
        this.maxValue = this.fromBalance;

        const fromValueControl = this.swapForm.get('fromValue');
        if (fromValueControl) {
            fromValueControl.setValidators([
            Validators.required,
            Validators.min(0.000000000000000001),
            this.maxValueValidator(this.maxValue)
            ]);
            fromValueControl.updateValueAndValidity();
        }
    }

    isSigninTX: boolean = false;
    swap() {
        if (this.swapForm.get('fromValue')?.valid) {
            // TODO: Swap logic
            const isUnwrap: boolean = this.fromName === 'WETH';
            const value: number = this.swapForm.get('fromValue')?.value;

            const valueInWeiString = this.web3.toWei(value.toString(), 'ether');

            if (isUnwrap) {
                this.isSigninTX = true;
                this.web3.unwrapWETH(valueInWeiString).then((result: any) => {
                    console.log('unwrapWETH result', result);
                    
                    this.web3.decreaseBalance('WETH', value.toString());
                    this.web3.increaseBalance('ETH', value.toString());

                    const balanceMap = this.getBalanceMap();
                    this.fromBalance = parseFloat(balanceMap[this.fromName]);
                    this.toBalance = parseFloat(balanceMap[this.toName]);
                    
                    // Update the max value and validate the form
                    this.maxValue = this.fromBalance;

                    const fromValueControl = this.swapForm.get('fromValue');
                    if (fromValueControl) {
                        fromValueControl.setValidators([
                        Validators.required,
                        Validators.min(0.000000000000000001),
                        this.maxValueValidator(this.maxValue)
                        ]);
                        fromValueControl.updateValueAndValidity();
                    }

                    this.notify.openSnackBar('Successfully unwrapped WETH', 'Close');
                    this.isSigninTX = false;
                    //this.dialogRef.close();
                    
                }).catch((error: any) => {
                    console.log('unwrapWETH error', error);
                    this.isSigninTX = false;
                });

            } else {
                this.isSigninTX = true;
                this.web3.wrapETH(valueInWeiString).then((result: any) => {
                    console.log('wrapETH result', result);
                    this.web3.decreaseBalance('ETH', value.toString());
                    this.web3.increaseBalance('WETH', value.toString());

                    const balanceMap = this.getBalanceMap();
                    this.fromBalance = parseFloat(balanceMap[this.fromName]);
                    this.toBalance = parseFloat(balanceMap[this.toName]);

                    // Update the max value and validate the form
                    this.maxValue = this.fromBalance;

                    const fromValueControl = this.swapForm.get('fromValue');
                    if (fromValueControl) {
                        fromValueControl.setValidators([
                        Validators.required,
                        Validators.min(0.000000000000000001),
                        this.maxValueValidator(this.maxValue)
                        ]);
                        fromValueControl.updateValueAndValidity();
                    }

                    this.notify.openSnackBar('Successfully wrapped ETH', 'Close');
                    this.isSigninTX = false;
                    //this.dialogRef.close();
                }).catch((error: any) => {
                    this.isSigninTX = false;
                    console.log('wrapETH error', error);
                });
            }
        } else {
            console.log('Invalid input');
        }
    }

    setMaxValue() {
        this.swapForm.get('fromValue')?.setValue(this.maxValue);
    }
}
