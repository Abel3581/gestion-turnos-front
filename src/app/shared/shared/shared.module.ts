import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastDangerComponent } from '../components/toast-danger/toast-danger.component';
import { ToastSuccessComponent } from '../componets/toast-success/toast-success.component';



@NgModule({
  declarations: [
    ToastDangerComponent,
    ToastSuccessComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastDangerComponent,
    ToastSuccessComponent
  ]
})
export class SharedModule { }
