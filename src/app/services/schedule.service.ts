import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScheduleResponse } from '../models/response/schedule-response';
import { Observable } from 'rxjs';
import { Page } from '../models/response/page';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private apiUrl = 'http://localhost:8080/schedules';

  constructor(private http: HttpClient) {}

  getPaginatedSchedule(
    page: number,
    size: number,
    centerName: string,
    startDate: Date,
    endDate: Date
  ): Observable<Page<ScheduleResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('centerName', centerName)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<Page<ScheduleResponse>>(`${this.apiUrl}/paged`, { params });
  }

}

