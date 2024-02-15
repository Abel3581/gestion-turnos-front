import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-mi-consultorio',
  templateUrl: './mi-consultorio.component.html',
  styleUrl: './mi-consultorio.component.css'
})
export class MiConsultorioComponent implements OnInit{
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalPatiens: number = 0;
  totalAgendas: number = 0;

  constructor(private patientService: PatientService,
              private centerService: HealthCenterService,
              private local: LocalAuthService,
              private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    const userId = this.local.getUserId();
    const name = this.local.getName();
    const surname = this.local.getSurname();
    this.name = name;
    this.surname = surname;
    this.emailUser = this.local.getEmail();
    this.patientService.getTotalPatientsByUserId(userId!).subscribe(
      total => {
        this.totalPatiens = total;
      }
    );
    this.centerService.totalCentersByUser(userId!).subscribe(
      total => {
        this.totalAgendas = total;
      }
    );
      this.reinicializarFlowBite();
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }


}
