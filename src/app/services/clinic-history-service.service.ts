import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConsultationRequest } from '../models/request/consultation-request';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/response/message-response';
import { ClinicHistoryResponse } from '../models/response/clinic-history-response';

@Injectable({
  providedIn: 'root'
})
export class ClinicHistoryServiceService {
  private urlClinic = 'http://localhost:8080/clinic-history';

  constructor(private http: HttpClient) { }

  public addClinicHistory(patientId: number, userId: number, request: ConsultationRequest): Observable<MessageResponse>{
    const url = `${this.urlClinic}/add-patient`;
    let params = new HttpParams()
    params = params.append('patientId', patientId);
    params = params.append('userId', userId);
    return this.http.post<MessageResponse>(url, request, { params: params });
  }

  public getAllClinicHistory(patientId: number, centerName: string): Observable<ClinicHistoryResponse[]>{
    const url = `${this.urlClinic}/getAll`;
    let params = new HttpParams()
    params = params.append('patientId', patientId);
    params = params.append('centerName', centerName);
    return this.http.get<ClinicHistoryResponse[]>(url, { params: params });
  }

  public deletedClinicHistory(id: number):Observable<MessageResponse>{
    const url = `${this.urlClinic}/${id}`;
    return this.http.delete<MessageResponse>(url);
  }
}
