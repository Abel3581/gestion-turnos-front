import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { RouterModule } from '@angular/router';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';
import localeEs from '@angular/common/locales/es';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// Registra los datos de localización para español
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    ProfileComponent,
    HealthCenterComponent,
    ScheduleFormComponent,
    ViewScheduleComponent

  ],
  imports: [
    FormsModule,
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    TooltipModule,
    RouterModule,
    NgxPaginationModule,
    TableModule,
    ButtonModule

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    // ...
  ],
})
export class HomeModule { }
