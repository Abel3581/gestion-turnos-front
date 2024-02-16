import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnUpdateService {
  private turnSubscription: Subscription | undefined;
  private turnAddedSource = new Subject<void>();

  turnAdded$ = this.turnAddedSource.asObservable();

  notifyTurnAdded() {
    this.turnAddedSource.next();
  }

  public unsubscribeAll(): void {
    this.turnSubscription?.unsubscribe();
  }
}
