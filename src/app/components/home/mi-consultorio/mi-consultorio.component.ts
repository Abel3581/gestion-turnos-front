import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { TurnResponse } from 'src/app/models/response/turn-response';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { TurnService } from 'src/app/services/turn.service';

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
  turns: TurnResponse [] = [];
  selectedOption: string = 'Pendiente'; // Valor por defecto
  options: string [] = ['En_curso', 'Finalizado', 'No_llegó'];

  constructor(private patientService: PatientService,
              private centerService: HealthCenterService,
              private local: LocalAuthService,
              private cdr: ChangeDetectorRef,
              private turnService: TurnService
              ){}

  ngOnInit(): void {
    const userId = this.local.getUserId();
    const name = this.local.getName();
    const surname = this.local.getSurname();
    this.name = name;
    this.surname = surname;
    this.emailUser = this.local.getEmail();
    // this.http.get<string[]>('./assets/data/hours.json').subscribe((data) => {
    //   this.hours = data;

    // });
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
      this.getAllTurnsByUserId();
      this.reinicializarFlowBite();
  }

  getAllTurnsByUserId(){
    const userId = this.local.getUserId();
    this.turnService.getAllTurnsByUserId(userId!).subscribe(
      response => {
        console.log(response);
        this.turns = response;
        this.reinicializarFlowBite();
      },
      error => {
        console.log(error);
      }
    )
  }

  updateSelectedOption(option: string) {
    this.selectedOption = option;
}


  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }


}
