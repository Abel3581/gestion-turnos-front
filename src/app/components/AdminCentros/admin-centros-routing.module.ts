import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCenterComponent } from './edit-center/edit-center.component';
import { PatientsCenterComponent } from './patients-center/patients-center.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {path: 'edit-center/:centerName', component: EditCenterComponent},
      {path: 'edit-center/patients/:centerName', component: PatientsCenterComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RouterModule],
})
export class AdminCentrosRoutingModule { }
