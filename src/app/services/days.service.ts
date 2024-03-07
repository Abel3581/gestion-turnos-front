import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessHoursRequest } from '../models/request/business-hours-request';
import { Observable, catchError, map } from 'rxjs';
import { MessageResponse } from '../models/response/message-response';
import { BusinessHoursResponse } from '../models/response/business-hours-response';

@Injectable({
  providedIn: 'root'
})
export class DaysService {

  urlDays = 'http://localhost:8080/days';

  constructor(private http: HttpClient) { }

  public createAttentionDays(request: BusinessHoursRequest): Observable<MessageResponse> {
    const url = `${this.urlDays}/create`;
    return this.http.post<MessageResponse>(url, request);
  }

  public getAllBusinessHours(centerName: string): Observable<BusinessHoursResponse[]> {
    const url = `${this.urlDays}/centerName`;
    const params = { centerName };
    return this.http.get<BusinessHoursResponse[]>(url, { params });
  }

  getAllBusinessHoursByCenterAndUserId(centerName: string, userId: number): Observable<BusinessHoursResponse[]> {
    const url = `${this.urlDays}/business-hours?centerName=${centerName}&userId=${userId}`;

    return this.http.get<BusinessHoursResponse[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getAllBusinessHoursByCenterAndUserIdAndDay(centerName: string, userId: number, day: string): Observable<BusinessHoursResponse[]> {
    const url = `${this.urlDays}/business-hours-day?centerName=${centerName}&userId=${userId}&day=${day}`;

    return this.http.get<BusinessHoursResponse[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error', error);
    return new Observable<never>(() => {
      throw error;
    });
  }

  deleteBusinessHourById(horaId: number, userId: number): Observable<MessageResponse> {
    const url = `${this.urlDays}/${horaId}/user/${userId}`;
    return this.http.delete<MessageResponse>(url);
  }


}
