import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { CreatePaymentComponent } from './create-payment/create-payment.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-payment', component: CreatePaymentComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RouterModule],
})
export class AdminRoutingModule { }
