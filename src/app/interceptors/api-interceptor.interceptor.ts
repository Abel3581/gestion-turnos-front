import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, finalize } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class ApiInterceptorInterceptor implements HttpInterceptor {

  constructor(private ngxUiLoaderService: NgxUiLoaderService) {}
  private activeRequest = 0;
  // Lista de URLs que deben excluirse del loader
  private excludedUrls: string[] = ['/term', '/delete'];

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('**INGRESANDO AL INTERCEPTOR**');

    // Verificar si la solicitud debe activar el loader
    if (this.shouldShowLoader(request)) {
      this.startLoader();
    }

    this.activeRequest++;

    return next.handle(request).pipe(
      catchError(error => {
        this.stopLoader();
        throw error;
      }),
      finalize(() => this.stopLoader())
    );
  }

  private shouldShowLoader(request: HttpRequest<unknown>): boolean {
    // Agrega la lógica para verificar si el loader debe mostrarse según la solicitud
    // Puedes usar la URL, el método HTTP u otros criterios según tus necesidades
    // Ejemplo: return !request.url.includes('no-loader-endpoint');
    return !this.excludedUrls.some(url => request.url.includes(url));
  }

  private stopLoader(): void {
    this.activeRequest--;
    if(this.activeRequest === 0){
      this.ngxUiLoaderService.stop();
    }
  }
  private startLoader(): void {
    if (this.activeRequest === 0) {
      this.ngxUiLoaderService.start();
    }
  }
}
