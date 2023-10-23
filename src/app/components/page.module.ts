import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    InitionSesionComponent,
    CreateAccountComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class PageModule { }
