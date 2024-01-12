import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { LazyLoadEvent } from 'primeng/api';
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
  businessHours: BusinessHoursResponse[] = [];
  hours: number[] = [];
  diasSemana: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  fechasSemana: Date[] = [];
  fechaActual: Date = new Date();

  constructor(private dateService: DataService, private http: HttpClient, private centers: HealthCenterService,
    private local: LocalAuthService, private daysService: DaysService, private scheduleService: ScheduleService) {


  }

  ngOnInit(): void {
    this.calcularFechasSemana(this.fechaActual);
    initFlowbite();
    this.http.get<number[]>('./assets/data/hours.json').subscribe((data) => {
      this.hours = data;

    });
    this.getAllCentersName();

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
  }

  avanzarSemana() {
    this.fechaActual.setDate(this.fechaActual.getDate() + 7);
    this.calcularFechasSemana(this.fechaActual);
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
    this.getAllBusinessHours();
  }

  getAllBusinessHours() {
    console.log("Entrando al metodo getAllBusinessHours()")
    this.daysService.getAllBusinessHours(this.selectedCenter.name).subscribe(
      response => {
        console.log("Horas y dias:", response);
        this.businessHours = response;
        console.log("Horas de la agenda: " + this.selectedCenter.name, response);
      },
      err => {
        console.log(err.error);
      }
    )
  }






}

