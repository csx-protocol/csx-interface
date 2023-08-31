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

enum ListedItemsPixelBreakPoints {
  one = 499,
  two = 736,
  three = 970,
  four = 1200,
}

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
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave',
        animate(600, style({ opacity: 0 }))
      )
    ])
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
    this.breakpoint = this._getBreakpoint(window.innerWidth);
    this.recentlyListed.step = this._getBreakpoint(window.innerWidth);
  }

  onResize(event: EventTarget | null | any) {
    if (event)
      this.breakpoint = this._getBreakpoint(event.target.innerWidth);
      this.recentlyListed.step = this._getBreakpoint(event.target.innerWidth);
  }

  private _getBreakpoint(innerWidth: number): number {
    const breakpoint =    
        innerWidth <= ListedItemsPixelBreakPoints.one
          ? 1
          : innerWidth <= ListedItemsPixelBreakPoints.two
          ? 2
          : innerWidth <= ListedItemsPixelBreakPoints.three
          ? 3
          : innerWidth <= ListedItemsPixelBreakPoints.four
          ? 4
          : 5;
    return breakpoint;
  }

  createRangeForSkeletonLoader(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

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
  
  partnerIdToSteamId64(partnerId: string): string {
    return (BigInt(partnerId) + BigInt(76561197960265728n)).toString();
  }
}
