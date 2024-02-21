import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-botones-patient-record',
  templateUrl: './botones-patient-record.component.html',
  styleUrl: './botones-patient-record.component.css'
})
export class BotonesPatientRecordComponent {
  @Input() centerName!: string;
  @Input() patientId: number = 0;

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
