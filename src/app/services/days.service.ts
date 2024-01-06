import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessHoursRequest } from '../models/request/business-hours-request';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/response/message-response';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  urlDays = 'http://localhost:8080/days';

  constructor(private http: HttpClient) {}

  public createAttentionDays(request: BusinessHoursRequest): Observable<MessageResponse>{
    const url = `${this.urlDays}/create`;
    return this.http.post<MessageResponse>(url, request);
  }
}
