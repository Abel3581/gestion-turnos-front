import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageModule } from './components/auth/page.module';


const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./components/auth/page.module').then(m => m.PageModule)
  },
  {
    path:'home',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule )
  },
  {path: '',  redirectTo: 'auth',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[RouterModule],

})
export class AppRoutingModule { }
