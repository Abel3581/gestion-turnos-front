import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastDangerComponent } from '../components/toast-danger/toast-danger.component';
import { ToastSuccessComponent } from '../componets/toast-success/toast-success.component';
import { ToastInfoComponent } from '../components/toast-info/toast-info.component';



@NgModule({
  declarations: [
    ToastDangerComponent,
    ToastSuccessComponent,
    ToastInfoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastDangerComponent,
    ToastSuccessComponent,
    ToastInfoComponent
  ]
})
export class SharedModule { }
