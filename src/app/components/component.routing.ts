import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';



const routes: Routes = [
  {
    path: 'home',
    component: InitionSesionComponent
  },
  {
    path: 'cuenta',
    component: CreateAccountComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule
  ]
})

export class ComponentRoutingModule {}
