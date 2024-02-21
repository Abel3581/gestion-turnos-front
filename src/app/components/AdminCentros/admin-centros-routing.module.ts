import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCenterComponent } from './edit-center/edit-center.component';
import { PatientsCenterComponent } from './patients-center/patients-center.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {path: 'edit-center/:centerName', component: EditCenterComponent},
      {path: 'edit-center/patients/:centerName', component: PatientsCenterComponent},
      {path: 'patient-record/:centerName/:patientId', component: PatientRecordComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RouterModule],
})
export class AdminCentrosRoutingModule { }
