import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditCenterComponent } from './edit-center/edit-center.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {path: 'edit-center/:centerName', component: EditCenterComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RouterModule],
})
export class AdminCentrosRoutingModule { }
