import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Web3Service } from '../../../app/shared/web3.service';
import { NotificationService } from '../../../app/shared/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-step',
  templateUrl: './sign-step.component.html',
  styleUrls: ['./sign-step.component.scss']
})
export class SignStepComponent implements AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  // Function to provide necessary info for callFunction
  @Input() txInfo!:
    {
      name: string,
      method: string,
      params: any[],
      txType: 'call' | 'send',
      options?: { from?: string, value?: string, gas?: string, gasPrice?: string },
    };

  // Event to notify parent component when callFunction is complete or upon error
  @Output() callFunctionComplete
    = new EventEmitter<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    private _web3: Web3Service,
    private _notify: NotificationService,) {
  }

  getApprovalToken = (txInfo: any) => {
    console.log('txInfo', txInfo);
    
    const { name, method } = txInfo;

    if (name === 'StakedCSX' && method === 'stake') {
      return 'CSXToken';
    }

    if (name === 'VestedCSX' && method === 'vest') {
      return 'EscrowedCSX';
    }

    if(name === 'VestedStaking' && method === 'withdraw') {
      return 'VestedCSX';
    }

    throw new Error(`Invalid transaction information provided in sign-step component: ${txInfo}`);
  };

  functionInfoSubscription!: Subscription;
  async ngAfterViewInit() {

    this.stepper._stepHeader.forEach(step => {
      step._elementRef.nativeElement.style.pointerEvents = 'none';
    });

    this.validateAllowance().then((hasAllowance) => {
      console.log('allowance afterwards?', hasAllowance);
      if (hasAllowance) {
        this.firstFormGroup.get('firstCtrl')!.setValue('valid');
        this.stepper.next();
        this._runSendFunction();
      } else {
        // approve...
        console.log('this.txInfo.name', this.txInfo.name);
        const params = this.txInfo.params.length > 1 ? this.txInfo.params[1] : this.txInfo.params[0];
        const spender = this.txInfo.name == 'VestedStaking' ? this.txInfo.params[0] : this._web3.contracts[this.txInfo.name].options.address;
        this._callFunction(
          this.getApprovalToken(this.txInfo),
          'approve',
          [
            spender,
            params
          ],
          'send'
        )
        //this._web3.approve('CSX', this._web3.contracts['StakedCSX'].options.address, this.txInfo.params[0])
        .then((result) => {
          if (result) {
            const [hasError, data] = result;

            if (hasError) {
              this._notify.openSnackBar(`Approval Failed: ${data}`, 'OK');
              return this.callFunctionComplete.emit(false);
            }

            this.firstFormGroup.get('firstCtrl')!.setValue('valid');
            this.stepper.next();
            this._runSendFunction();
          } else {
            //this._notice.openSnackBar('Approval failed', 'OK');
            console.error('Transaction failed flat', result);
            //this.callFunctionComplete.emit(false);
          }
        }).catch((error) => {
          //this._notice.openSnackBar('Approval failed: ' + error.message, 'OK');
          console.error(error);
          //this.callFunctionComplete.emit(false);
          return error;
        });
      }
    }
    ).catch((error) => {
      console.error(error);
    });
  }

  private _runSendFunction() {
    this._callFunction(
      this.txInfo.name,
      this.txInfo.method,
      this.txInfo.params,
      this.txInfo.txType,
      this.txInfo.options
    ).then((result) => {
      if (result) {
        console.log('RESILT???', result);

        const [hasError, data] = result;

        if (hasError) {
          this._notify.openSnackBar(`${this.txInfo.method} failed: ${data}`, 'OK');
          return this.callFunctionComplete.emit(false);
        }

        this._notify.openSnackBar(`${this.txInfo.method} successful 🫡`, 'OK');
        this.callFunctionComplete.emit(true);
      }
    }
    ).catch((error) => {
      //this._notice.openSnackBar('Transaction failed: ' + error.message, 'OK');
      console.error(error);
      //this.callFunctionComplete.emit(false);
    });
  }

  isFirstStepComplete = false;
  // isSecondStepComplete = false;
  private async validateAllowance(): Promise<boolean> {
    const spender = this.txInfo.name == 'VestedStaking' ? this.txInfo.params[0] : this._web3.contracts[this.txInfo.name].options.address;
    
    return await this._web3.callContractMethod(
      this.getApprovalToken(this.txInfo),
      'allowance',
      [
        this._web3.webUser.address!,
        spender
      ],
      'call'
    ).then((result) => {
      console.log('allowance', result);
      console.log('this.txInfo.params', this.txInfo.params);
      const spendAmount = this._web3.csxInstance.web3.utils.toBN(
        this.txInfo.name == 'VestedStaking' ? this.txInfo.params[1] : this.txInfo.params[0]
      );
      const allowance = this._web3.csxInstance.web3.utils.toBN(result);

      // If SpendAmount is greater than allowance, return false, else return true.

      if (spendAmount.gt(allowance)) {
        return false;
      } else {
        return true;
      }
    }
    ).catch((error) => {
      //this.callFunctionComplete.emit(false);
      return error;
    });
  }

  private async _callFunction(
    _contractName: string,
    methodName: string,
    methodParams: any[],
    transactionType: 'call' | 'send',
    options?: { from?: string, value?: string, gas?: string, gasPrice?: string },
  ): Promise<[boolean, any]> {
    return this._web3.callContractMethod(
      _contractName,
      methodName,
      methodParams,
      transactionType,
      options
    ).then((result) => {
      if (result) {
        //this._notify.notify('Transaction successful', 'OK');
        return [false, result];
      } else {
        //this._notify.notify('Transaction failed flat', 'OK');
        console.error('Transaction failed flat', result);
        throw new Error('Transaction failed: ', result);
      }
    }
    ).catch((error) => {
      //this._notice.notify('Transaction failed: ' + error.message, 'OK');
      console.error(error);
      return [true, error.message];
    }) as Promise<[boolean, any]>;
  }

}
