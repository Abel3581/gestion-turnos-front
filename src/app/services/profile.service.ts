import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ProfileResponse } from '../models/response/profile-response';
import { ProfileRequest } from '../models/request/profile-request';
import { MessageResponse } from '../models/response/message-response';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private urlProfile = "http://localhost:8080/profile";
  constructor(private http: HttpClient) { }

  public getProfile(userId: number): Observable<ProfileResponse>{
    const url = `${this.urlProfile}/${userId}`;
    return this.http.get<ProfileResponse>(url);
  }

  public update(id: number, userId: number, request: ProfileRequest): Observable<MessageResponse>{
    const url = `${this.urlProfile}/${id}/profile/${userId}`;
    return this.http.put<MessageResponse>(url, request);
  }

}
