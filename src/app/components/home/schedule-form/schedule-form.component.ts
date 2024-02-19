
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { BusinessHoursRequest } from 'src/app/models/request/business-hours-request';
import { HealthCenterNamesResponse } from 'src/app/models/response/health-center-names-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { TotalCentrosService } from 'src/app/services/compartidos/total-centros.service';
import { DaysService } from 'src/app/services/days.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css'
})
export class ScheduleFormComponent implements OnInit {
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  mostrarToastDander: boolean = false;
  timeForm: FormGroup;
  centersNames!: HealthCenterNamesResponse[];
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalCentros: number = 0;
  totalPatients: number = 0;
  totalAgendas: number = 0;

  constructor(private healthService: HealthCenterService,
    private fb: FormBuilder,
    private local: LocalAuthService,
    private daysService: DaysService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private totalCentrosService: TotalCentrosService,
    private patientService: PatientService,
    private centerService: HealthCenterService) {
    this.timeForm = fb.group({
      centerName: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['18:00', Validators.required],
      day: ['', Validators.required]

    })

  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.getAllCentersName();
    this.totalCentrosService.totalCentros$.subscribe(
      total => {
        this.totalCentros = total;
      }
    );
    this.patientService.getTotalPatientsByUserId(this.local.getUserId()!).subscribe(
      total => {
        this.totalPatients = total;
      }
    );
    this.centerService.totalCentersByUser(this.local.getUserId()!).subscribe(
      total => {
        this.totalAgendas = total;
      }
    );
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToast = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    this.reinicializarFlowBite();
  }

  public createAttentionDays() {
    //TODO agregar toasts nuevos
    const businessHoursRequest: BusinessHoursRequest = this.timeForm.value;
    const userId = this.local.getUserId()!;
    businessHoursRequest.userId = userId;
    const startTimeString = businessHoursRequest.startTime;
    const endTimeString = businessHoursRequest.endTime;

    const startTimeMinutes = this.convertTimeStringToMinutes(startTimeString);
    const endTimeMinutes = this.convertTimeStringToMinutes(endTimeString);
    const specificHourMin = "09:00";

    const specificHourMax = "23:30";
    const specificHourMaximo = this.convertTimeStringToMinutes(specificHourMin);
    const specificHourMinimo = this.convertTimeStringToMinutes(specificHourMax);

    if (startTimeMinutes < specificHourMaximo || endTimeMinutes > specificHourMinimo) {
      // this.tostr.info("Ingresa un horario en el rango de 09:00hs a 23:30hs.")
    } else {
      if (this.timeForm.valid) {
        console.log("Entrando al metodo createAttentionDays()");
        this.daysService.createAttentionDays(businessHoursRequest).subscribe(
          response => {
            console.log(response);
            this.mostrarToast = true;
            this.mensajeToast = response.message;
          },
          err => {
            console.log(err.error);
            this.mostrarToastDander = true;
            this.mensajeToast = err.error;
          }
        )
      } else {
            this.mostrarToastDander = true;
            this.mensajeToast = "Datos no validos";
        this.timeForm.markAllAsTouched();
      }
    }


  }

  convertTimeStringToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  public getAllCentersName() {
    const userId = this.local.getUserId();
    if (userId != null) {
      this.healthService.getAllCentersName(userId).subscribe(
        response => {
          this.centersNames = response;
          console.log("Response: ", JSON.stringify(response));
        },
        err => {
          console.log("Error" + err.error);
        }
      )
    }
  }

  incrementHours(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes + 60) % (24 * 60); // Incrementa en 60 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  decrementHours(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes - 60 + 24 * 60) % (24 * 60); // Decrementa en 60 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  incrementMinutes(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes + 5) % (24 * 60); // Incrementa en 5 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  decrementMinutes(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes - 5 + 24 * 60) % (24 * 60); // Decrementa en 5 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainder).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }
}
