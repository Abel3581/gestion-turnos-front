import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

// import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { ComponentRoutingModule } from './component.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptorInterceptor } from 'src/app/interceptors/api-interceptor.interceptor';
import { TokenInterceptor } from 'src/app/interceptors/token.interceptor';


@NgModule({
  declarations: [
    InitionSesionComponent,
    CreateAccountComponent,


  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,


  ],
  providers: [AuthService, LocalAuthService,
    {provide: HTTP_INTERCEPTORS,useClass: ApiInterceptorInterceptor,multi:true},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],


})
export class PageModule { }
