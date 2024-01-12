import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptorInterceptor } from './interceptors/api-interceptor.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageModule } from './components/auth/page.module';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    PageModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    BrowserAnimationsModule,
    RouterModule

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
