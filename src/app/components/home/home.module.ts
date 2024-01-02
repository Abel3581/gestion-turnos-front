import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [
    ProfileComponent,
    HealthCenterComponent,
    ProfileFormComponent

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,InputGroupModule,InputGroupAddonModule,
    InputTextModule,
    ButtonModule

  ]
})
export class HomeModule { }
