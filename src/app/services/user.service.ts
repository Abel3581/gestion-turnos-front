import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUserResponse } from '../models/response/current-user-response';

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

}
