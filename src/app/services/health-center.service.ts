import { HttpClient, HttpParams } from '@angular/common/http';
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

  public totalPatientsByCenter(userId: number, centerName: string): Observable<number>{
    const url = `${this.urlCenter}/total-patients`;
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('centerName', centerName);
    return this.http.get<number>(url, { params: params });
  }

  public totalCentersByUser(userId: number): Observable<number>{
    const url = `${this.urlCenter}/total-centers`;
    let params = new HttpParams();
    params = params.append('userId', userId);
    return this.http.get<number>(url, { params: params });
  }

  //Creo el servicio para conectarme con el back
  public deletePatientByCenter(userId: number, centerName: string, patientId: number):Observable<MessageResponse>{
    const url = `${this.urlCenter}/delete-patient`;
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('centerName', centerName);
    params = params.append('patientId', patientId);
    return this.http.delete<MessageResponse>(url, { params: params});

  }

  public deleteCenterById(id: number): Observable<MessageResponse>{
    const url = `${this.urlCenter}/delete-center/${id}`;
    return this.http.delete<MessageResponse>(url);
  }

}
