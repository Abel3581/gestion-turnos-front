import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TotalCentrosService {
  private totalCentrosSubject = new BehaviorSubject<number>(0);
  totalCentros$ = this.totalCentrosSubject.asObservable();

  constructor() {}

  getTotalCentros(): number {
    return this.totalCentrosSubject.value;
  }

  setTotalCentros(value: number): void {
    this.totalCentrosSubject.next(value);
  }
}
