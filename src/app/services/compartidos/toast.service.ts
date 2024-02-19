import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private cerrarToastSubject = new Subject<void>();

  cerrarToast$ = this.cerrarToastSubject.asObservable();

  cerrarToast() {
    this.cerrarToastSubject.next();
  }
  cerrarToastDanger() {
    this.cerrarToastSubject.next();
  }
  constructor() { }
}
