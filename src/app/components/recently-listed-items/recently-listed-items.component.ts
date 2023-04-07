import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, map } from 'rxjs';
import { Web3Service } from '../../shared/web3.service';
import { CsgoItemsService } from '../../shared/csgo-items.service';
import { RecentlyListedItemsService } from './recently-listed-items.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { BuyDialog } from './utils/buy.dialog';
import { Item } from '../../shared/item.interface';

@Component({
  selector: 'app-recently-listed-items',
  templateUrl: './recently-listed-items.component.html',
  styleUrls: ['./recently-listed-items.component.scss'],
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
export class RecentlyListedItemsComponent implements OnInit, OnDestroy {
  state = 'in'; // for animation
  breakpoint!: number;
  constructor(
    public csgoItems: CsgoItemsService,
    public web3: Web3Service,
    public recentlyListed: RecentlyListedItemsService,
    public sanitizer: DomSanitizer, //Used in .html
    private dialog: MatDialog
  ) {
    this.initBreakpoint();
  }

  scrollSubscription: any;
  autoScroll = false;
  async ngOnInit() {
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        map(() => {
          let scrollHeight, scrollTop, clientHeight;
          if (document.documentElement) {
            scrollHeight = document.documentElement.scrollHeight;
            scrollTop = document.documentElement.scrollTop;
            clientHeight = document.documentElement.clientHeight;
          } else {
            scrollHeight = document.body.scrollHeight;
            scrollTop = document.body.scrollTop;
            clientHeight = document.body.clientHeight;
          }
          if (scrollHeight - scrollTop === clientHeight) {
            if (this.recentlyListed.autoScroll) {
              this.recentlyListed.loadNextStep();
            }
          }
        })
      )
      .subscribe();
    this.recentlyListed.initialize();
  }

  initBreakpoint() {
    this.breakpoint =
      window.innerWidth <= 400
        ? 1
        : window.innerWidth <= 600
        ? 2
        : window.innerWidth <= 900
        ? 3
        : window.innerWidth <= 1200
        ? 4
        : 5;
  }

  onResize(event: EventTarget | null | any) {
    if (event)
      this.breakpoint =
        event.target.innerWidth <= 400
          ? 1
          : event.target.innerWidth <= 600
          ? 2
          : event.target.innerWidth <= 900
          ? 3
          : event.target.innerWidth <= 1200
          ? 4
          : 5;
  }

  // openDialog1(name: string, price: string, sellerAddy: string, avgDeliveryTime: string, floats: FloatValues, imageLink: string): void {
  //   // Open dialog with name:
  //   const dialogRef = this.dialog.open(BuyDialog, {
  //     data: {
  //       name: name,
  //       price: price,
  //       sellerAddy: sellerAddy,
  //       avgDeliveryTime: avgDeliveryTime,
  //       floats: floats,
  //       imageLink: imageLink
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  openDialog(_item: Item): void {   
    const dialogRef = this.dialog.open(BuyDialog, {
      data: _item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }
}
