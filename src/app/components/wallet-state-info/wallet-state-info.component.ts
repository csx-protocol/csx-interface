import { Component } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-wallet-state-info',
  templateUrl: './wallet-state-info.component.html',
  styleUrls: ['./wallet-state-info.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ])
    ])
  ]
})
export class WalletStateInfoComponent {
  constructor(public readonly web3: Web3Service) {
    this.startCountdown();
  }
  tookTooLong: boolean = false;
  startCountdown() {
    const timeout = setTimeout(() => {
      this.tookTooLong = true;
    }, 10000); // 10000 milliseconds = 10 seconds
  }
}
