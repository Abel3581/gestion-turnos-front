import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class ApiInterceptorInterceptor implements HttpInterceptor {

  constructor(private ngxUiLoaderService: NgxUiLoaderService) {}
  private activeRequest = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('**INGRESANDO AL INTERCEPTOR**');
    if(this.activeRequest === 0){
      this.ngxUiLoaderService.start();
    }
    this.activeRequest++; //1

    return next.handle(request).pipe(finalize(() => this.stopLoader()));
  }

  private stopLoader(): void {
    this.activeRequest--;
    if(this.activeRequest === 0){
      this.ngxUiLoaderService.stop();
    }
  }
}
