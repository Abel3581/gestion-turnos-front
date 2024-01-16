import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientRequest } from '../models/request/patient-request';
import { MessageResponse } from '../models/response/message-response';


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  urlPatient = "http://localhost:8080/patients";

  constructor(private http: HttpClient) { }

  public createPatient(userId: number, request: PatientRequest): Observable<MessageResponse>{
    const url = `${this.urlPatient}/${userId}`;
    return this.http.post<MessageResponse>(url, request);

  }

}
