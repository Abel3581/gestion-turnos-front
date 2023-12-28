import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LocalAuthService } from '../services/local-auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private local: LocalAuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.toLowerCase().includes('cuenta')) {
      return next.handle(request);
    }
    const token = this.local.getToken();
    console.log('Token antes de la solicitud:', token);
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    console.log('Token en la solicitud:', token);
    return next.handle(request);

  }
}
