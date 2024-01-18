
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';

import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { RouterModule } from '@angular/router';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';
import localeEs from '@angular/common/locales/es';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreatePatientsComponent } from './create-patients/create-patients.component';
import { ModalTurnsComponent } from './modal-turns/modal-turns.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';



// Registra los datos de localización para español
registerLocaleData(localeEs);

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ProfileComponent,
    HealthCenterComponent,
    ScheduleFormComponent,
    ViewScheduleComponent,
    UserProfileComponent,
    CreatePatientsComponent,
    ModalTurnsComponent

  ],

  imports: [
    FormsModule,
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    TooltipModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,



  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    // ...
  ],
})
export class HomeModule { }
