import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastNoAnimationModule, ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    InitionSesionComponent,
    CreateAccountComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 4000, // Duración predeterminada del toast en milisegundos
      positionClass: 'toast-top-right', // Posición del toast
      preventDuplicates: true, // Evitar duplicados
    }),
    ToastNoAnimationModule
  ]
})
export class PageModule { }
