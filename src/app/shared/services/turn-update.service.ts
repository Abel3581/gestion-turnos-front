import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TurnUpdateService {

  private turnAddedSource = new Subject<void>();

  turnAdded$ = this.turnAddedSource.asObservable();

  notifyTurnAdded() {
    this.turnAddedSource.next();
  }
}
