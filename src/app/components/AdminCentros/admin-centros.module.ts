import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCentrosRoutingModule } from './admin-centros-routing.module';
import { RouterModule } from '@angular/router';
import { EditCenterComponent } from './edit-center/edit-center.component';
import { DaysComponent } from './days/days.component';
import { BotonesComponent } from './botones/botones.component';
import { PatientsCenterComponent } from './patients-center/patients-center.component';


@NgModule({
  declarations: [
    EditCenterComponent,
    DaysComponent,
    BotonesComponent,
    PatientsCenterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AdminCentrosRoutingModule
  ]
})
export class AdminCentrosModule { }
