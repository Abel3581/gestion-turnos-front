import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-botones',
  templateUrl: './botones.component.html',
  styleUrl: './botones.component.css'
})
export class BotonesComponent implements OnInit{
  @Input() centerName!: string;

  constructor(private router: Router,
              private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
   this.reinicializarFlowBite();
  }

  navegarADias(){

    this.router.navigate(['/edit/edit-center/', this.centerName]);

  }
  navegarAPacientes(){

    this.router.navigate(['/edit/edit-center/patients/', this.centerName]);

  }
  navegarAAgendaPrincipal(){
    this.router.navigate(['/home/view-schedule']);

  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

}
