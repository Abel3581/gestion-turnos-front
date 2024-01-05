import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';

@NgModule({
  declarations: [
    ProfileComponent,
    HealthCenterComponent,
    ProfileFormComponent,
    ScheduleFormComponent

  ],
  imports: [
    FormsModule,
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    TooltipModule

  ]
})
export class HomeModule { }
