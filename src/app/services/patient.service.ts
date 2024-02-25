import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PatientRequest } from '../models/request/patient-request';
import { MessageResponse } from '../models/response/message-response';
import { PatientResponse } from '../models/response/patient-response';
import { PatientPageResponse } from '../models/response/patient-page-response';
import { Page } from '../models/response/page';



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

  public searchPatient(term: string, userId: number): Observable<PatientResponse[]>{
    const url = `${this.urlPatient}/term`;
    let params = new HttpParams();
    params = params.append('term', term);
    params = params.append('userId', userId);
    return this.http.get<PatientResponse[]>(url, { params: params } );
  }

  public getPatientsPage(userId:number, centerName: string, page: number, size: number):Observable<Page<PatientPageResponse>>{
    const url = `${this.urlPatient}/page`;
    let params = new HttpParams()
    params = params.append('userId', userId);
    params = params.append('centerName', centerName);
    params = params.append('page', page);
    params = params.append('size', size);
    return this.http.get<Page<PatientPageResponse>>(url, { params: params });

  }

  public getTotalPatientsByUserId(userId: number): Observable<number>{
    const url = `${this.urlPatient}/total-patients`;
    let params = new HttpParams();
    params = params.append('userId', userId);
    return this.http.get<number>(url, { params: params});
  }

  public getPatientByIdAndUserId(patientId: number, userId: number): Observable<PatientPageResponse>{
    const url = `${this.urlPatient}/patient-by-id-and-user-id`;
    let params = new HttpParams();
    params = params.append('patientId', patientId);
    params = params.append('userId', userId);
    return this.http.get<PatientPageResponse>(url, { params:  params });
  }

  public updatePatient(patientId: number, userId: number, request: PatientRequest): Observable<MessageResponse>{
    const url = `${this.urlPatient}/update-patient`;
    let params = new HttpParams();
    params = params.append('patientId', patientId);
    params = params.append('userId', userId);
    return this.http.put<MessageResponse>(url, request, { params: params });
  }

  public getPatientById(patientId: number): Observable<PatientPageResponse>{
    const url = `${this.urlPatient}/${patientId}`;
    return this.http.get<PatientPageResponse>(url);
  }

  public searchPatients(centerName: string, userId: number, term: string):Observable<PatientPageResponse[]>{
    const url = `${this.urlPatient}/search`;
    let params = new HttpParams();
    params = params.append('centerName', centerName);
    params = params.append('userId', userId);
    params = params.append('term', term);
    return this.http.get<PatientPageResponse[]>(url, { params: params });

  }

  public searchPatientsByCenterNameAndUser(centerName: string, userId: number){
    const url = `${this.urlPatient}/search`;
    let params = new HttpParams();
    params = params.append('centerName', centerName);
    params = params.append('userId', userId);
    return this.http.get<PatientPageResponse[]>(url, { params: params });
  }
}
