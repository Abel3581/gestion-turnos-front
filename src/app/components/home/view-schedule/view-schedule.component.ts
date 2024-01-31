import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { format } from 'date-fns';

import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';

import { BusinessHoursResponse } from 'src/app/models/response/business-hours-response';
import { HealthCenterNamesResponse } from 'src/app/models/response/health-center-names-response';
import { LocalDate } from 'src/app/models/response/local-date';
import { TurnResponse } from 'src/app/models/response/turn-response';
import { DataService } from 'src/app/services/data.service';
import { DaysService } from 'src/app/services/days.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TurnService } from 'src/app/services/turn.service';
import { ModalServiceService } from 'src/app/shared/services/modal-service.service';
import { TurnUpdateService } from 'src/app/shared/services/turn-update.service';



@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.css'
})
export class ViewScheduleComponent implements OnInit {

  selectedCenter!: HealthCenterNamesResponse;
  centersName!: HealthCenterNamesResponse[];
  attentionDays: BusinessHoursResponse[] = [];
  turns: TurnResponse[] = [];
  hours: string[] = [];
  diasSemana: string[] = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  fechasSemana: Date[] = [];
  fechaActual: Date = new Date();
  visible: boolean = false;

  constructor(private dateService: DataService, private http: HttpClient, private centers: HealthCenterService,
    private local: LocalAuthService, private daysService: DaysService, private scheduleService: ScheduleService,
    private cdr: ChangeDetectorRef, private modalService: ModalServiceService,
    private turnService: TurnService, private turnUpdateService: TurnUpdateService) {

  }

  ngOnInit(): void {
    this.getAllCentersName();
    this.calcularFechasSemana(this.fechaActual);
    this.http.get<string[]>('./assets/data/hours.json').subscribe((data) => {
      this.hours = data;

    });
    this.turnUpdateService.turnAdded$.subscribe(() => {
      this.getAllTurnsByCenterName();
    });
    this.reinicializarFlowBite();
    console.log("Fecha actual: ", this.fechaActual);
  }

  // Calculos paginacion fecha //

  obtenerDosUltimosDigitos(): string {
    return this.fechaActual.getFullYear().toString().slice(-2);
  }

  calcularFechasSemana(fecha: Date) {
    // Obtener el primer día de la semana (lunes)
    const primerDiaSemana = fecha.getDate() - fecha.getDay() + (fecha.getDay() === 0 ? 0 : (fecha.getDay() === 0 ? -6 : 0));

    // Crear una nueva fecha con el primer día de la semana
    const fechaInicioSemana = new Date(fecha.setDate(primerDiaSemana));

    this.fechasSemana = [];

    // Iterar para obtener las fechas de lunes a domingo
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaInicioSemana);
      fecha.setDate(fechaInicioSemana.getDate() + i);
      this.fechasSemana.push(fecha);
      //console.log("Índice: " + i + ", Fecha de la semana: " + fecha);
    }
  }

  retrocederSemana() {
    this.fechaActual.setDate(this.fechaActual.getDate() - 7);
    this.calcularFechasSemana(this.fechaActual);
    this.getAllTurnsByCenterName();
    this.reinicializarFlowBite();

  }

  avanzarSemana() {
    this.fechaActual.setDate(this.fechaActual.getDate() + 7);
    this.calcularFechasSemana(this.fechaActual);
    this.getAllTurnsByCenterName();
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
    this.getAllTurnsByCenterName();
    this.reinicializarFlowBite();
  }

  getAllBusinessHours() {
    console.log("Entrando al metodo getAllBusinessHours()")
    if (this.selectedCenter && this.selectedCenter.name) {
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
    if (!day) {
      return false;
    }
    const normalizedDay = day.toLowerCase();  // Normaliza a minúsculas

    // console.log('Normalized Day:', normalizedDay);

    return this.attentionDays.some((attentionDay) => {
      // console.log('Attention Day:', attentionDay.day.toLowerCase());
      return attentionDay.day.toLowerCase() === normalizedDay &&
        this.compareTimes(hora, attentionDay.startTime) >= 0 &&
        this.compareTimes(hora, attentionDay.endTime) <= 0;
    });

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

  public showDialog() {
    this.visible = true;
  }

  public modalClose() {
    this.visible = false;
  }

  // Llama a showModal() con los datos necesarios
  public openModal(fecha: Date, hora: string): void {

    const dateFormat = this.dateFormat(fecha);
    // Convierte la cadena formateada nuevamente a un objeto Date
    const fechaFormateada = new Date(dateFormat);
    console.log("OpenMOdal: Fecha: " + dateFormat + " Hora" + hora + " Centro: " + this.selectedCenter.name);
    this.modalService.showModal(fecha, hora, this.selectedCenter.name);
  }

  // Función para formatear la fecha en "YYYY-MM-DD"
  private dateFormat(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getAllTurnsByCenterName() {
    const centerName: string = this.selectedCenter.name;
    this.turnService.getAllTurnsByCenterName(centerName).subscribe(
      response => {
        console.log(response);
        this.turns = response;
      },
      error => {
        console.error(error);
      }
    )
  }

  // Método para comparar la hora y fecha
  compareHourAndDate(hora: string, fecha: Date, turn: TurnResponse): boolean {
    const formattedDate = this.formatDate(turn.date);
    return hora === turn.hour && formattedDate === this.formatDate(fecha);
  }

  // Método para formatear la fecha (puede ser cadena o Date)
  formatDate(date: string | Date): string {
    // Si es una cadena, simplemente devolverla
    if (typeof date === 'string') {
      return date;
    }

    // Si es un objeto Date, formatearlo
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // En tu componente
  isTurnAssigned(hora: string, fecha: Date): boolean {
    return this.turns.some(turn => this.compareHourAndDate(hora, fecha, turn));
  }
  // En tu componente
  hasAssignedTurn(hora: string, fecha: Date): boolean {
    return this.turns.some(turn => this.compareHourAndDate(hora, fecha, turn));
  }

  getPatientInfo(hora: string, fecha: Date): TurnResponse | undefined {
    return this.turns.find(turn => this.compareHourAndDate(hora, fecha, turn));
  }











}

