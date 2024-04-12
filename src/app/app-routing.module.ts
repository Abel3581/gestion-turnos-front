import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./components/auth/page.module').then( m => m.PageModule )
  },
  {
    path: 'home',
    loadChildren: () => import('./components/home/home.module').then( m => m.HomeModule )
  },
  {
    path: 'edit',
    loadChildren: () => import('./components/AdminCentros/admin-centros.module').then( m => m.AdminCentrosModule )
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then( m => m.AdminModule )
  },
  {path: '',  redirectTo: 'auth',pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[RouterModule],

})
export class AppRoutingModule { }
