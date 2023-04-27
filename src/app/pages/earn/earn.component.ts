import { Component } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';

@Component({
  selector: 'app-earn',
  templateUrl: './earn.component.html',
  styleUrls: ['./earn.component.scss']
})
export class EarnComponent {

  constructor(public web3: Web3Service){}

  cardData = [
    { label: 'Card 1 Label', value: 'Card 1 Value' },
    { label: 'Card 2 Label', value: 'Card 2 Value' },
    { label: 'Card 3 Label', value: 'Card 3 Value' },
    { label: 'Card 4 Label', value: 'Card 4 Value' },
  ];

  
  addCommas(num: number | string): string {
    const [integerPart, decimalPart] = num.toString().split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  }
}
