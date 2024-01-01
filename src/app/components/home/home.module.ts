import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';



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


  ]
})
export class HomeModule { }
