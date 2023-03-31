import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

interface Notification {
  message: string;
  link?: string;
  linkText?: string;
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  notifications: Notification[] = [];
  private notificationSubject: Subject<number>;
  public newNotification$: Observable<number>;

  constructor(private snackBar: MatSnackBar) {
    this.notificationSubject = new Subject<number>();
    this.newNotification$ = this.notificationSubject.asObservable();
  }

  notify(_notice: string, _link?: string, _linkText?: string) {
    const _notify: Notification = {
      message: _notice,
      link: _link,
      linkText: _linkText
    }
    this.notifications.unshift(_notify);
    this.notificationSubject.next(1);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: ['blue-snackbar'],
    });
  }

  ngOnDestroy(): void {
    this.notificationSubject.unsubscribe();
  }
}
