import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiInterceptorInterceptor } from './interceptors/api-interceptor.interceptor';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageModule } from './components/auth/page.module';
import { SharedModule } from './shared/shared/shared.module';



@NgModule({

  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    RouterModule,
    SharedModule,




  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorInterceptor,multi:true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
