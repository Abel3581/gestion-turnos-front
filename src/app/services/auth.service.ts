import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { Observable, catchError, map, pipe, tap, throwError } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlBack = "http://localhost:8080/auth";
private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});
  constructor(private http: HttpClient) { }


  public login(request: Login):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.urlBack}/login`,request);
  }

  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.error('Se ha producio un error ', error.error);
    }
    if(error.status === 403){
      console.error('El Usuario ya existe', error.error);
    }
    if(error.status === 400){
      console.error('Error de validaciones', error.error);
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }
}
