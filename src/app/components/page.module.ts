import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';



@NgModule({
  declarations: [
    InitionSesionComponent,
    CreateAccountComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PageModule { }
