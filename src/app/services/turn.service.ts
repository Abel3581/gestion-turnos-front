import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/response/message-response';
import { TurnResponse } from '../models/response/turn-response';


@Injectable({
  providedIn: 'root'
})
export class TurnService {
  private urlTurn = 'http://localhost:8080/turns';

  constructor(private http: HttpClient) {}

  public createPatientTurn(centerName: string, date: string, hour: string, dni: string, userId: number): Observable<MessageResponse>{
    const url = `${this.urlTurn}/create`;
    let params = new HttpParams();
    params = params.append('centerName', centerName);
    params = params.append('date', date);
    params = params.append('hour', hour);
    params = params.append('dni', dni);
    params = params.append('userId', userId)
    return this.http.post<MessageResponse>(url, null, { params: params });

  }

  public getTurnByCenterNameAndDateAndHour(centerName: string, date: string, hour: string): Observable<TurnResponse>{
    const url = `${this.urlTurn}/turn-by-cdh`;
    let params = new HttpParams();
    params = params.append('centerName', centerName);
    params = params.append('date', date);
    params = params.append('hour', hour);
    return this.http.get<TurnResponse>(url, { params: params});
  }

  getAllTurnsByCenterName(centerName: string): Observable<TurnResponse[]>{
    const url = `${this.urlTurn}/center-name`;
    let param = new HttpParams();
    param = param.append('centerName', centerName);
    return this.http.get<TurnResponse[]>(url, { params: param });
  }

  deleteTurnById(turnId: number): Observable<MessageResponse>{
    const url = `${this.urlTurn}/delete/${turnId}`;
    return this.http.delete<MessageResponse>(url);
  }

  public getAllTurnsByCenterNameAndUserId(centerName: string, userId: number): Observable<TurnResponse[]>{
    const url = `${this.urlTurn}/center-name-userId`;
    let params = new HttpParams();
    params = params.append('centerName', centerName);
    params = params.append('userId', userId);
    return this.http.get<TurnResponse[]>(url, { params: params});
  }

  public getAllTurnsByUserId(userId: number): Observable<TurnResponse[]>{
    const url = `${this.urlTurn}/all-by-user`;
    let params = new HttpParams();
    params = params.append('userId', userId);
    return this.http.get<TurnResponse[]>(url, { params: params });
  }

  public changeStatus(turnId: number, status: string): Observable<MessageResponse>{
    const url = `${this.urlTurn}/change-status`;

    let params = new HttpParams();
    params = params.append('turnId', turnId);
    params = params.append('status', status);

    return this.http.put<MessageResponse>(url, {}, { params : params });

  }

  public deletePatient(patientId: number): Observable<MessageResponse>{
    const url = `${this.urlTurn}/delete/patient/${patientId}`;
    let params = new HttpParams();
    params = params.append('patientId', patientId);
    return this.http.delete<MessageResponse>(url, { params: params });
  }

  public searchTurnsByDateAndDni(date: string, dni: string, userId: number): Observable<TurnResponse[]>{
    const url = `${this.urlTurn}/search-turns`;
    let params = new HttpParams();
    params = params.append('date', date);
    params = params.append('dni', dni);
    params = params.append('userId', userId);
    return this.http.get<TurnResponse[]>(url, { params : params });
  }

  public searchTurnsByDateAndDniFilters(date: string, term: string, userId: number): Observable<TurnResponse[]>{
    const url = `${this.urlTurn}/filters`;
    let params = new HttpParams();
    params = params.append('date', date);
    params = params.append('term', term);
    params = params.append('userId', userId);
    return this.http.get<TurnResponse[]>(url, { params : params });
  }



}
