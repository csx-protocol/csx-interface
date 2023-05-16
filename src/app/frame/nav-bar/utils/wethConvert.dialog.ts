import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Inject, } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Web3Service } from "../../../shared/web3.service";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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

    toName: string = 'ETH';
    toBalance: number = 0;

    maxValueValidator(maxValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const forbidden = control.value > maxValue;
          return forbidden ? { 'maxValue': { value: control.value } } : null;
        };
      }
      

    constructor(
        private dialogRef: MatDialogRef<wethConvertDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private web3: Web3Service,
        private fb: FormBuilder
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

    toggleDirection() {
        // Define a mapping for easier lookup
        const balanceMap: {[key: string]: string} = {
            'WETH': this.web3.webUser.balances!['WETH'].balanceEth,
            'ETH': this.web3.webUser.balances!['ETH'].balanceEth
        };
        
        // Swap the fromName and toName
        [this.fromName, this.toName] = [this.toName, this.fromName];
        
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

    swap() {
        if (this.swapForm.get('fromValue')?.valid) {
            // TODO: Swap logic
            const isUnwrap: boolean = this.fromName === 'WETH';
            const value: number = this.swapForm.get('fromValue')?.value;

            const valueInWeiString = this.web3.csxInstance.window.utils.toWei(value.toString(), 'ether');
        } else {
            console.log('Invalid input');
        }
    }

    setMaxValue() {
        this.swapForm.get('fromValue')?.setValue(this.maxValue);
    }
}
