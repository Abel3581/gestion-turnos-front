import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserResponse } from '../models/response/current-user-response';
import { HealthCenterResponse } from '../models/response/health-center-response';
import { MessageResponse } from '../models/response/message-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlUser = "http://localhost:8080/users";
  constructor(private http: HttpClient) { }

  public getCurrentUser(): Observable<CurrentUserResponse>{
    const url = `${this.urlUser}/me`;
    return this.http.get<CurrentUserResponse>(url);
  }

  public getAllCenterForUser(id: number): Observable<HealthCenterResponse[]>{
    const url = `${this.urlUser}/centers/${id}`;
    return this.http.get<HealthCenterResponse[]>(url);
  }

  public verifyStatusUser(userId: number): Observable<MessageResponse>{
    const url = `${this.urlUser}/${userId}/status`;
    return this.http.get<MessageResponse>(url);
  }


}
