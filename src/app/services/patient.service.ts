import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PatientRequest } from '../models/request/patient-request';
import { MessageResponse } from '../models/response/message-response';
import { PatientResponse } from '../models/response/patient-response';


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  urlPatient = "http://localhost:8080/patients";

  constructor(private http: HttpClient) { }

  public createPatient(userId: number, request: PatientRequest): Observable<MessageResponse>{
    const url = `${this.urlPatient}/${userId}`;
    return this.http.post<MessageResponse>(url, request).pipe(
      catchError((error) =>{
         // Aquí puedes manejar el error de la manera que desees
         console.error('Error en la llamada HTTP:', error);
         return throwError(error);
      })
    )

  }

  public searchPatient(term: string): Observable<PatientResponse[]>{
    const url = `${this.urlPatient}/term?term=${term}`;
    return this.http.get<PatientResponse[]>(url);
  }

}
