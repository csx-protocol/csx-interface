import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TradeStatus } from '../../../../components/my-trades/my-trades.component';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private statusSubject = new BehaviorSubject<TradeStatus | null>(null);
  status$ = this.statusSubject.asObservable();

  addStatus(status: TradeStatus) {
    this.statusSubject.next(status);
  }
}
