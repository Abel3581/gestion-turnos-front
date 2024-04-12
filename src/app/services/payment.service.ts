import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentResponse } from '../models/response/payment-response';
import { PaymentAppRequest } from '../models/request/paymentApp-request';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private  urlPayment = 'http://localhost:8080/payments';
  constructor(private http: HttpClient) { }

  public createPayment(request: PaymentAppRequest): Observable<PaymentResponse>{
    const url = `${this.urlPayment}/create`;
    return this.http.post<PaymentResponse>(url, request);
  }

}
