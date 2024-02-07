import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCentrosRoutingModule } from './admin-centros-routing.module';
import { RouterModule } from '@angular/router';
import { EditCenterComponent } from './edit-center/edit-center.component';
import { DaysComponent } from './days/days.component';


@NgModule({
  declarations: [
    EditCenterComponent,
    DaysComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminCentrosRoutingModule
  ]
})
export class AdminCentrosModule { }
