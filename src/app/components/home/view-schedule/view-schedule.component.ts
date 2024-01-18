import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { initFlowbite } from 'flowbite';

import { BusinessHoursResponse } from 'src/app/models/response/business-hours-response';
import { HealthCenterNamesResponse } from 'src/app/models/response/health-center-names-response';
import { DataService } from 'src/app/services/data.service';
import { DaysService } from 'src/app/services/days.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { ScheduleService } from 'src/app/services/schedule.service';



@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.css'
})
export class ViewScheduleComponent implements OnInit {

  selectedCenter!: HealthCenterNamesResponse;
  centersName!: HealthCenterNamesResponse[];
  attentionDays: BusinessHoursResponse[] = [];
  hours: string[] = [];
  diasSemana: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  fechasSemana: Date[] = [];
  fechaActual: Date = new Date();

  public modalVisible: boolean = false;

  public openModal(): void {
    this.modalVisible = true;
  }

  constructor(private dateService: DataService, private http: HttpClient, private centers: HealthCenterService,
    private local: LocalAuthService, private daysService: DaysService, private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef) {


  }

  ngOnInit(): void {

    this.getAllCentersName();
    this.calcularFechasSemana(this.fechaActual);

    this.http.get<string[]>('./assets/data/hours.json').subscribe((data) => {
      this.hours = data;

    });

    this.reinicializarFlowBite();

  }

  // Calculos paginacion fecha //

  obtenerDosUltimosDigitos(): string {
    return this.fechaActual.getFullYear().toString().slice(-2);
  }

  calcularFechasSemana(fecha: Date) {
    const primerDiaSemana = fecha.getDate() - fecha.getDay() + (fecha.getDay() === 0 ? -6 : 1);
    const fechaInicioSemana = new Date(fecha.setDate(primerDiaSemana));
    this.fechasSemana = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaInicioSemana);
      fecha.setDate(fechaInicioSemana.getDate() + i);
      this.fechasSemana.push(fecha);
    }
  }

  retrocederSemana() {
    this.fechaActual.setDate(this.fechaActual.getDate() - 7);
    this.calcularFechasSemana(this.fechaActual);
    this.reinicializarFlowBite();
  }

  avanzarSemana() {
    this.fechaActual.setDate(this.fechaActual.getDate() + 7);
    this.calcularFechasSemana(this.fechaActual);
    this.reinicializarFlowBite();
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  compararFechas(fecha1: Date, fecha2: Date): boolean {
    return fecha1.toDateString() === fecha2.toDateString();
  }
  // Fin Calculo fecha paginacion //

  guardarTurno(fecha: Date) {
    // Aquí puedes llamar a tu servicio para guardar el turno en la fecha seleccionada
    // Asegúrate de tener un servicio que se comunique con tu backend Java
    // this.turnoService.guardarTurno({ fecha: fecha.toISOString() }).subscribe(
    // Manejar la respuesta del servidor si es necesario
    // );
  }


  public getAllCentersName() {
    const userId = this.local.getUserId();
    this.centers.getAllCentersName(userId!).subscribe(
      response => {
        console.log("Centros: ", response);
        this.centersName = response;
      },
      err => {

        console.log(err.error);
      }
    )
  }

  selectCenter(center: any): void {
    this.selectedCenter = center;
    console.log("Centro seleccionado:", this.selectedCenter.name)
    this.getAllBusinessHours(); // <-- Activar método para obtener las horas de atención
    this.reinicializarFlowBite();
  }

  getAllBusinessHours() {
    console.log("Entrando al metodo getAllBusinessHours()")
    if(this.selectedCenter && this.selectedCenter.name){
      this.daysService.getAllBusinessHours(this.selectedCenter.name).subscribe(
        response => {

          this.attentionDays = response;
          console.log("Horas y dias:", response);
          this.cdr.detectChanges();
          console.log("Horas de la agenda: " + this.selectedCenter.name, response);
          this.reinicializarFlowBite();

        },
        err => {
          console.log(err.error);
          console.error('Error al obtener días de atención:', err);
        }
      )
    }
  }

  isCellEnabled(day: string, hora: string): boolean {
    // Lógica para determinar si la celda debería estar habilitada
    return this.attentionDays.some((attentionDay) =>
        attentionDay.day.toLowerCase() === day.toLowerCase() &&
        this.compareTimes(hora, attentionDay.startTime) >= 0 &&
        this.compareTimes(hora, attentionDay.endTime) <= 0
    );
}

// Función para comparar horas en formato HH:mm
compareTimes(time1: string, time2: string): number {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 !== hours2) {
        return hours1 - hours2;
    }

    // Si las horas son iguales, comparar los minutos
    return minutes1 - minutes2;
}










}

