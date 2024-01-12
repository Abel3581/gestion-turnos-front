import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { BusinessHoursRequest } from 'src/app/models/request/business-hours-request';
import { HealthCenterNamesResponse } from 'src/app/models/response/health-center-names-response';
import { DaysService } from 'src/app/services/days.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css'
})
export class ScheduleFormComponent implements OnInit {

  iconSeleccionado: string = "";
  timeForm: FormGroup;
  centersNames!: HealthCenterNamesResponse[];

  constructor(private healthService: HealthCenterService, private fb: FormBuilder,
    private local: LocalAuthService, private daysService: DaysService, private tostr: ToastrService,
    private router: Router) {
    this.timeForm = fb.group({
      centerName: ['', Validators.required],
      startTime: ['08:00', Validators.required],
      endTime: ['18:00', Validators.required],
      day: ['', Validators.required]

    })

  }

  ngOnInit(): void {
    this.getAllCentersName();
    initFlowbite();
    this.iconSeleccionado = "";
  }

  seleccionarIcono(icono: string): void {
    this.iconSeleccionado = icono;
    if(this.iconSeleccionado === 'profile'){
      this.router.navigate(['/home/profile']);
    }
    if(this.iconSeleccionado === 'center'){
      this.router.navigate(['/home/center']);
    }
    if(this.iconSeleccionado === 'calendar'){
      this.router.navigate(['/home/schedule']);
    }

  }

  public createAttentionDays(){
    const businessHoursRequest : BusinessHoursRequest = this.timeForm.value;
    console.log("Antes del valid")
    if(this.timeForm.valid){
      console.log("Entrando al metodo createAttentionDays()");
      this.daysService.createAttentionDays(businessHoursRequest).subscribe(
        response => {
          console.log(response);
          this.tostr.success(response.message);
        },
        err => {
          console.log(err.error);
          this.tostr.error(err.error);
        }
      )
    }else{
      this.tostr.error("Datos no validos");
      this.timeForm.markAllAsTouched();
    }

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
}
