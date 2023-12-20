import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitionSesionComponent } from './inition-sesion/inition-sesion.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { CommonModule } from '@angular/common';



const routes: Routes = [
  {
    path: '',
      children:[
        {
          path: 'cuenta',
          component: CreateAccountComponent
        },
        {
          path: '',
          component: InitionSesionComponent
        },

        // {
        //   path: '',
        //   redirectTo: 'login',
        //   pathMatch: 'full'
        // }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ComponentRoutingModule {}
