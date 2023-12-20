import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageModule } from './components/auth/page.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptorInterceptor } from './interceptors/api-interceptor.interceptor';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PageModule,
    AppRoutingModule,
    NgxUiLoaderModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
