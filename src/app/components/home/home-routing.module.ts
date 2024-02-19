import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { ViewScheduleComponent } from './view-schedule/view-schedule.component';
import { ViewPatientsComponent } from './view-patients/view-patients.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CreatePatientsComponent } from './create-patients/create-patients.component';
import { MiConsultorioComponent } from './mi-consultorio/mi-consultorio.component';


const routes: Routes = [
  {
    path: '',
    children:[
      { path: 'profile', component: ProfileComponent },
      { path: 'center', component: HealthCenterComponent},
      { path: 'schedule', component: ScheduleFormComponent},
      { path: 'view-schedule', component: ViewScheduleComponent},
      { path: 'view-patients', component: ViewPatientsComponent},
      { path: 'user-profile', component: UserProfileComponent},
      { path: 'create-patients', component: CreatePatientsComponent},
      { path: 'mi-consultorio', component: MiConsultorioComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RouterModule],
})
export class HomeRoutingModule { }
