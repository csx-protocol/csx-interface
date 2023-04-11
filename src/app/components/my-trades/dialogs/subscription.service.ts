import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChainEventsService } from '../../../shared/chain-events.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  // array of stored subscriptions
  subscriptions: { contractAddresses: string[]; callback: (event: any) => void; origin: string; subscription: Subscription }[] = [];

  constructor(private chainEventsService: ChainEventsService) { }

  addSubscription(contractAddresses: string[], callback: (event: any) => void, origin: string) {
    const subscription = this.chainEventsService.subscribeToContractEvents(callback, contractAddresses);
    this.subscriptions.push({ contractAddresses, callback, origin, subscription });
  }

  unsubscribe(contractAddresses?: string[], origin?: string) {
    const subscription = this.subscriptions.find(
      (s) => JSON.stringify(s.contractAddresses) === JSON.stringify(contractAddresses) && s.origin === origin
    );
    if (subscription) {
      subscription.subscription.unsubscribe();
      this.subscriptions = this.subscriptions.filter(
        (s) => JSON.stringify(s.contractAddresses) !== JSON.stringify(contractAddresses) || s.origin !== origin
      );
    }
  }

  unsubscribeAllWithOrigin(origin: string) {
    const subscriptionsToUnsubscribe = this.subscriptions.filter(
      (s) => s.origin === origin
    );

    subscriptionsToUnsubscribe.forEach((s) => {
      s.subscription.unsubscribe();
    });

    this.subscriptions = this.subscriptions.filter(
      (s) => s.origin !== origin
    );
  }

  unsubscribeAll() {
    this.subscriptions.forEach((s) => {
      s.subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  showAllSubscriptions() {
    console.log('this.subscriptions', this.subscriptions);
  }
}
