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
  cerrarToastCenters() {
    this.cerrarToastSubject.next();
  }
  cerrarToastDanger() {
    this.cerrarToastSubject.next();
  }
  cerrarToastInfo() {
    this.cerrarToastSubject.next();
  }
  constructor() { }
}
