import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';
import { ComponentRoutingModule } from './component.routing';
import { RouterModule } from '@angular/router';
import { ToastSuccessComponent } from 'src/app/shared/componets/toast-success/toast-success.component';
import { ToastDangerComponent } from 'src/app/shared/components/toast-danger/toast-danger.component';



@NgModule({
  declarations: [
    InitionSesionComponent,
    CreateAccountComponent,
    ToastSuccessComponent,
    ToastDangerComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ComponentRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Duración predeterminada del toast en milisegundos
      positionClass: 'toast-top-right', // Posición del toast
      preventDuplicates: true, // Evitar duplicados
    }),
    ToastNoAnimationModule,
    RouterModule


  ]
})
export class PageModule { }
