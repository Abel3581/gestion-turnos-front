import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-create-patients',
  templateUrl: './create-patients.component.html',
  styleUrl: './create-patients.component.css'
})
export class CreatePatientsComponent implements OnInit{

  iconSeleccionado: string = '';
  constructor(private router: Router, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    initFlowbite();
    this.iconSeleccionado = '';
  }

  seleccionarIcono(icono: string): void {
    this.iconSeleccionado = icono;
    console.log('Icono seleccionado:', icono);
    if (this.iconSeleccionado === 'profile') {
      console.log('Navegando a /home/user-profile');
      this.router.navigate(['/home/user-profile']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'center') {
      console.log('Navegando a /home/center');
      this.router.navigate(['/home/center']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'calendar') {
      console.log('Navegando a /home/schedule');
      this.router.navigate(['/home/schedule']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'users'){
      console.log('Navegando a /home/create-patients');
      this.router.navigate(['/home/create-patiens']);
      this.reinicializarFlowBite();
    }

  }

  private reinicializarFlowBite(){
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
    }


}
