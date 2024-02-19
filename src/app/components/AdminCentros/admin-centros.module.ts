import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCentrosRoutingModule } from './admin-centros-routing.module';
import { RouterModule } from '@angular/router';
import { EditCenterComponent } from './edit-center/edit-center.component';
import { DaysComponent } from './days/days.component';
import { BotonesComponent } from './botones/botones.component';
import { PatientsCenterComponent } from './patients-center/patients-center.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [
        EditCenterComponent,
        DaysComponent,
        BotonesComponent,
        PatientsCenterComponent,
        // ToastDangerComponent,
        // ToastSuccessComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AdminCentrosRoutingModule,
        SharedModule,
        HttpClientModule

    ]
})
export class AdminCentrosModule { }
