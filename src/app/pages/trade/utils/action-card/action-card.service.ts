import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TradeStatus } from '../../trade.component';

@Injectable({
  providedIn: 'root'
})
export class ActionCardService {
  private tradeStatusSubject: Subject<TradeStatus> = new Subject<TradeStatus>();
  tradeStatus$: Observable<TradeStatus> = this.tradeStatusSubject.asObservable();

  constructor() { }

  updateTradeStatus(status: TradeStatus) {
    this.tradeStatusSubject.next(status);
  }
}
