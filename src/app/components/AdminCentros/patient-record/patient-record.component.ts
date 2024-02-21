import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrl: './patient-record.component.css'
})
export class PatientRecordComponent implements OnInit, AfterViewInit{

  centerName: string = '';
  patientId: number = 0;
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  constructor(private route: ActivatedRoute,
              private cdr: ChangeDetectorRef

  ){

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.centerName = params['centerName'];
      this.patientId = params['patientId'];

      console.log("Centro de paciente-recordComponent: " + this.centerName);
      console.log("IdPaciente de paciente-recordComponent: " + this.patientId);
    });
    this.reinicializarFlowBite();
  }

  ngAfterViewInit(): void {
    console.log(this.patientId)
  }

  addClinicHistory() {
    const patientId = this.patientId;
    const centerName = this.centerName;

    console.log("Se apreto el boton agregar historia clinica");
  }
  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

}
