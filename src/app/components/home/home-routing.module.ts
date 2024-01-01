import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { HealthCenterComponent } from './health-center/health-center.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';


const routes: Routes = [
  {
    path: '',
    children:[
      { path: 'profile', component: ProfileComponent },
      { path: 'center', component: HealthCenterComponent},
      { path: 'form', component: ProfileFormComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
