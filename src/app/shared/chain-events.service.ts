import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ChainEventsService {

  constructor(private notice: NotificationService) { this.notice.openSnackBar('event', 'OK');}

  onEvent(event: any) {
    console.log('catched event', event);

    const status = event[1];
    console.log('status', status);

    switch (status) {
      case '0':
        // New Item
        this.notice.openSnackBar('Someone just listed a new item!', 'OK');
        // data: ★ Butterfly Knife | Slaughter (Minimal Wear)||28830789185||225482466+EP2Wgs2R||0.10804083198308945
        break;
      case '2':
        // Item Sold
        this.notice.openSnackBar('Someone just purchased an item!', 'OK');
        // data: ???
        break;
      default:
        break;
    }

    if(status == '2' || status == 2){
      this.notice.openSnackBar('Someone just purchased an item!', 'OK');
    } else {
      //this.notice.openSnackBar(event, 'OK');
    }

  }

  onError(error: any) {
    console.log('catched error', error);
  }
}
