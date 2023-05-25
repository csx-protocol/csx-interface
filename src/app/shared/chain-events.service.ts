import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Subject, Subscription, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChainEventsService {

  private eventSubject = new Subject<any>();

  constructor(private notice: NotificationService) { this.notice.openSnackBar('event', 'OK');}

  subscribeToAllEvents(callback: (event: any) => void): Subscription {
    return this.eventSubject.asObservable().subscribe(callback);
  }

  subscribeToContractEvents(callback: (event: any) => void, contractAddressFilter: string[]): Subscription {
    return this.eventSubject.asObservable()
      .pipe(filter(event => contractAddressFilter.includes(event.contractAddress)))
      .subscribe(callback);
  }

  onEvent(event: any) {
    console.log('catched event', event);
    this.eventSubject.next(event);

    const status = event[1];
    const contractAddress = event.contractAddress;
    const data = event.data;

    console.log('status', status);

    switch (status) {
      case '0':
        // New Item
        this.notice.openSnackBar('Someone just listed a new item!', 'OK');
        break;
      case '2':
        // Item Sold
        this.notice.openSnackBar('Someone just purchased an item!', 'OK');
        break;
      default:
        break;
    }

    if (status == '2' || status == 2) {
      this.notice.openSnackBar('Someone just purchased an item!', 'OK');
    } else {
      // this.notice.openSnackBar(event, 'OK');
    }
  }

  onError(error: any) {
    console.log('catched error', error);
    this.notice.openSnackBar(error, 'OK');
  }

}
