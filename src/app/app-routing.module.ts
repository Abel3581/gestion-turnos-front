import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageModule } from './components/page.module';


const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./components/page.module').then(m => m.PageModule)
  },
  {path: '',  redirectTo: 'auth',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[RouterModule],

})
export class AppRoutingModule { }
