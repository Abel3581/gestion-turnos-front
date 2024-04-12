import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastDangerComponent } from '../components/toast-danger/toast-danger.component';
import { ToastSuccessComponent } from '../componets/toast-success/toast-success.component';
import { ToastInfoComponent } from '../components/toast-info/toast-info.component';
import { ToastCentersComponent } from '../components/toast-centers/toast-centers.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ToastDangerComponent,
    ToastSuccessComponent,
    ToastInfoComponent,
    ToastCentersComponent,

  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastDangerComponent,
    ToastSuccessComponent,
    ToastInfoComponent,
    ToastCentersComponent
  ]
})
export class SharedModule { }
