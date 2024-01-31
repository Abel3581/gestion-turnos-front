import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HealthCenterRequest } from '../models/request/health-center-request';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/response/message-response';
import { HealthCenterNamesResponse } from '../models/response/health-center-names-response';

@Injectable({
  providedIn: 'root'
})
export class HealthCenterService {

  urlCenter = "http://localhost:8080/centers";

  constructor(private http: HttpClient) {}

  public createCenter(id: number ,request: HealthCenterRequest): Observable<MessageResponse>{
    const url = `${this.urlCenter}/user/${id}`;
    return this.http.post<MessageResponse>(url, request);
  }

  public getAllCentersName(userId: number): Observable<HealthCenterNamesResponse[]>{
    const url = `${this.urlCenter}/user/${userId}`;
    return this.http.get<HealthCenterNamesResponse[]>(url);
  }

}
