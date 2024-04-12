import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoucherResponse } from '../models/response/voucher-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { VoucherRequest } from '../models/request/voucher-request';

@Injectable({
  providedIn: 'root'
})
export class VouchersService {

  private urlVoucher = `http://localhost:8080/vouchers`;

  constructor(private http: HttpClient) { }

  public getAllVouchersByUserId(userId: number): Observable<VoucherResponse[]>{
    const url = `${this.urlVoucher}/${userId}`;
    return this.http.get<VoucherResponse[]>(url);
  }

  public updatePayments(request: VoucherRequest): Observable<VoucherResponse>{
    const url = `${this.urlVoucher}/update`;
    return this.http.put<VoucherResponse>(url, request);
  }

}
