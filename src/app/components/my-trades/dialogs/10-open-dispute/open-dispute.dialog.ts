import { AfterViewInit, Component, Inject, Input } from "@angular/core";
import { MyTradeItem } from "../my-trade-item.interface";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Web3Service } from "../../../../shared/web3.service";

@Component({
  selector: 'trades-open-dispute-dialog',
  templateUrl: './open-dispute.dialog.html',
  styleUrls: ['./open-dispute.dialog.scss'],
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
export class OpenDisputeDialog implements AfterViewInit {
  @Input() item: MyTradeItem | undefined;
  // reasonControl: FormControl;
  // form: FormGroup;
  firstFormGroup: FormBuilder | any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,
    private web3: Web3Service) {
    console.log(this.data);
    this.item = this.data;

    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    console.log('dialog item', this.item);
  }

  isDisputing: boolean = false;
  createDispute() {
    console.log('this.firstFormGroup.invalid', this.firstFormGroup.invalid);
    
    if(this.firstFormGroup.invalid) {
      console.log('invalid form');      
      return;
    }

    console.log('valid form');

    this.isDisputing = true;

    this.web3.callContractMethod('Trade', 'openDispute', [this.item!.contractAddress ,this.firstFormGroup.value.firstCtrl], 'send').then((result) => {
      console.log('result', result);
      this.isDisputing = false;
    }
    ).catch((error) => {
      console.log('error', error);
      this.isDisputing = false;
    });
  }
}
