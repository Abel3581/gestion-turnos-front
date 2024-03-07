import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';
import { BusinessHoursResponse } from 'src/app/models/response/business-hours-response';
import { HealthCenterNamesResponse } from 'src/app/models/response/health-center-names-response';
import { ImageResponse } from 'src/app/models/response/image-response';
import { TurnResponse } from 'src/app/models/response/turn-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { DataService } from 'src/app/services/data.service';
import { DaysService } from 'src/app/services/days.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { TurnService } from 'src/app/services/turn.service';
import { ModalServiceService } from 'src/app/shared/services/modal-service.service';
import { TurnUpdateService } from 'src/app/shared/services/turn-update.service';



@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrl: './view-schedule.component.css'
})
export class ViewScheduleComponent implements OnInit, AfterViewInit, OnDestroy {
  // En tu componente, define un nuevo array para almacenar la información de cada celda
  filas: { hora: string; fecha: Date; isCellEnabled: boolean; hasAssignedTurn: boolean; turnInfo?: TurnResponse }[] = [];
  selectedCenter!: HealthCenterNamesResponse;
  turnInfo!: TurnResponse;
  centersName: HealthCenterNamesResponse[] = [];
  attentionDays: BusinessHoursResponse[] = [];
  turns: TurnResponse[] = [];
  hours: string[] = [];
  diasSemana: string[] = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  fechasSemana: Date[] = [];
  fechaActual: Date = new Date();
  visible: boolean = false;
  loadingAva: boolean = false;
  loadingRet: boolean = false;
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalPatiens: number = 0;
  totalAgendas: number = 0;
  mostrarToast: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;

  constructor(private http: HttpClient,
    private centers: HealthCenterService,
    private local: LocalAuthService,
    private daysService: DaysService,
    private cdr: ChangeDetectorRef,
    private modalService: ModalServiceService,
    private zone: NgZone,
    private turnService: TurnService,
    private turnUpdateService: TurnUpdateService,
    private patientService: PatientService,
    private toastService: ToastService,
    private imageService: ImageService
  ) {
  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.getAllCentersName();
    this.calcularFechasSemana(this.fechaActual);
    this.http.get<string[]>('./assets/data/hours.json').subscribe((data) => {
      this.hours = data;

    });
    this.turnUpdateService.turnAdded$.subscribe(() => {
      //this.getAllTurnsByCenterName();
      this.mostrarToast = true;
      this.mensajeToast = "Turno creado"
      this.getAllTurnsByCenterNameAndUserId();
    });
    this.centers.totalCentersByUser(this.local.getUserId()!).subscribe(
      total => {
        this.totalAgendas = total;
      }
    );
    this.patientService.getTotalPatientsByUserId(this.local.getUserId()!).subscribe(
      total => {
        this.totalPatiens = total;
      }
    );
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToast = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });

    this.getImage();
    //console.log("Fecha actual: ", this.fechaActual);
    console.log('ngOnInit called');

  }

  ngAfterViewInit(): void {
    this.reinicializarFlowBite();

  }

  ngOnDestroy(): void {
    this.turnUpdateService.unsubscribeAll();
  }

  // Calculos paginacion fecha //
  obtenerDosUltimosDigitos(): string {
    return this.fechaActual.getFullYear().toString().slice(-2);
  }

  calcularFechasSemana(fecha: Date) {

    // Obtener el primer día de la semana (lunes)
    const primerDiaSemana = fecha.getDate() - fecha.getDay();
    // Crear una nueva fecha con el primer día de la semana (clonando la fecha original)
    const fechaInicioSemana = new Date(fecha.getTime());
    this.fechasSemana = [];
    // Usar un bucle más simple para construir la lista de fechas
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaInicioSemana);
      fecha.setDate(primerDiaSemana + i);
      this.fechasSemana.push(fecha);
    }

  }

  retrocederSemana() {
    this.loadingRet = true;
    // Resto de tu lógica aquí
    setTimeout(() => {
      this.loadingRet = false;
    }, 100)
    setTimeout(() => {
      this.actualizarFechaSemana(-7);
    })

  }

  avanzarSemana() {
    this.loadingAva = true;
    // Resto de tu lógica aquí
    setTimeout(() => {
      this.loadingAva = false;
    }, 100)
    setTimeout(() => {
      this.actualizarFechaSemana(+7);
    })

  }

  private actualizarFechaSemana(dias: number) {
    this.fechaActual.setDate(this.fechaActual.getDate() + dias);
    this.calcularFechasSemana(this.fechaActual);
    // if (this.centersName && this.selectedCenter) {
    //   this.getAllTurnsByCenterName();
    // }
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
    //this.getAllBusinessHours(); // <-- Activar método para obtener las horas de atención
    this.getAllBusinessHoursByCenterAndUserId();
    //this.getAllTurnsByCenterName();
    this.getAllTurnsByCenterNameAndUserId();

    this.reinicializarFlowBite();
  }

  getAllBusinessHours() {
    console.log("Entrando al metodo getAllBusinessHours()")
    if (this.selectedCenter && this.selectedCenter.name) {
      this.daysService.getAllBusinessHours(this.selectedCenter.name).subscribe(
        response => {

          this.attentionDays = response;
          //console.log("Horas y dias:", response);
          //this.cdr.detectChanges();
          //console.log("Horas de la agenda: " + this.selectedCenter.name, response);
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
    const normalizedDay = day.toLowerCase(); // Normaliza a minúsculas
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

    // const dateFormat = this.dateFormat(fecha);
    // Convierte la cadena formateada nuevamente a un objeto Date
    // const fechaFormateada = new Date(dateFormat);
    // console.log("OpenMOdal: Fecha: " + dateFormat + " Hora" + hora + " Centro: " + this.selectedCenter.name);
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
    //console.log('getAllTurnsByCenterName - Center Name:', centerName)
    if (centerName && this.selectedCenter) {
      this.turnService.getAllTurnsByCenterName(centerName).subscribe(
        response => {
          console.log('getAllTurnsByCenterName - Response:', response);
          this.turns = response;
          this.reinicializarFlowBite();
        },
        error => {
          console.error('getAllTurnsByCenterName - Error:', error);
        }
      )
    }
  }

  getAllTurnsByCenterNameAndUserId() {
    console.log("getAllTurnsByCenterNameAndUserId()");
    if (this.selectedCenter != null) {
      const centerName: string = this.selectedCenter.name;
      console.log("Centro:", centerName);
      const userId = this.local.getUserId();
      if (centerName && this.selectedCenter && userId != null) {
        this.turnService.getAllTurnsByCenterNameAndUserId(centerName, userId).subscribe(
          response => {
            this.turns = response;
            console.log("Turnos getAllTurnsByCenterNameAndUserId():", response);
          },
          error => {
            console.log(error);
          }
        )
      }
    }
  }

  getAllBusinessHoursByCenterAndUserId() {
    console.log("getAllBusinessHoursByCenterAndUserId()");
    const centerName: string = this.selectedCenter.name;
    const userId = this.local.getUserId();
    if (centerName && this.selectedCenter && userId != null) {
      this.daysService.getAllBusinessHoursByCenterAndUserId(centerName, userId).subscribe(
        response => {
          console.log("Dia y hora de atencione: ", response);
          this.attentionDays = response;
          this.reinicializarFlowBite();
        },
        error => {
          console.error(error);
        }
      )
    }
  }

  // Método para comparar la hora y fecha
  compareHourAndDate(hora: string, fecha: Date, turn: TurnResponse): boolean {
    return hora === turn.hour && this.formatDate(fecha) === this.formatDate(turn.date);
  }


  // Método para formatear la fecha (puede ser cadena o Date)
  formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return date;
    }
    // return new Date(date).toISOString().split('T')[0];
    // Si es un objeto Date, formatearlo
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isTurnAssigned(hora: string, fecha: Date): boolean {
    return this.turns.some(turn => this.compareHourAndDate(hora, fecha, turn));
  }

  hasAssignedTurn(hora: string, fecha: Date): boolean {
    return this.turns.some(turn => this.compareHourAndDate(hora, fecha, turn));
  }

  getTurnByCenterNameAndDateAndHour(hora: string, fecha: Date) {
    console.log("Se apreto el buscar turno por hora, fecha y centro");
    const centerName: string = this.selectedCenter.name;
    const date: string = format(fecha, 'yyyy-MM-dd');
    if (centerName && hora && fecha) {
      this.turnService.getTurnByCenterNameAndDateAndHour(centerName, date, hora).subscribe(
        response => {
          console.log("Turnos del metodo getTurnByCenterNameAndDateAndHour", response);
          this.turnInfo = response;
        },
        error => {
          console.error(error);
        }
      )
    }
  }

  getPatientInfo(hora: string, fecha: Date): TurnResponse | undefined {
    return this.turns.find(turn => this.compareHourAndDate(hora, fecha, turn));
  }

  getDropdownId(i: number, j: number): string {
    return `dropdown${i}_${j}`;
  }

  getDropdownButtonId(i: number, j: number): string {
    return `dropdownDefaultButton${i}_${j}`;
  }

  getDropdownToggleId(i: number, j: number): string {
    return `dropdown${i}_${j}`;
  }

  getUserDropdownId(i: number, j: number): string {
    return `dropdownUsers${i}_${j}`;
  }

  getUserButtonId(i: number, j: number): string {
    return `dropdownUsersButton${i}_${j}`;
  }

  getUserToggleId(i: number, j: number): string {
    return `dropdownUsers${i}_${j}`;
  }


  calcularFilas() {
    // console.log('Turns:', this.turns);
    // console.log('Hours:', this.hours);
    // console.log('Fechas Semana:', this.fechasSemana);
    this.filas = [];

    for (let i = 0; i < this.hours.length; i++) {
      const hora = this.hours[i];

      for (let j = 0; j < this.fechasSemana.length; j++) {
        const fecha = this.fechasSemana[j];
        const diaSemana = this.diasSemana[j];

        // Asegúrate de que las fechas y horas se estén generando correctamente
        // console.log(`Hora: ${hora}, Fecha: ${fecha}, Día Semana: ${diaSemana}`);

        const isCellEnabled = this.isCellEnabled(diaSemana, hora);
        const hasAssignedTurn = this.hasAssignedTurn(hora, fecha);
        const turnInfo = hasAssignedTurn ? this.getPatientInfo(hora, fecha) : undefined;

        this.filas.push({ hora, fecha, isCellEnabled, hasAssignedTurn, turnInfo });
      }
    }
  }

  deleteShift(turnId: number | undefined) {
    console.log("Se apreto el boton borrar turno con id:", turnId);
    this.turnService.deleteTurnById(turnId!).subscribe(
      response => {
        console.log(response);

        this.zone.run(() => {
          this.getAllTurnsByCenterName();

        });
        this.mostrarToast = true;
        this.mensajeToast = response.message;
      },
      error => {
        console.error(error);
      }
    )

  }

  getImage(): void {
    console.log("Entrando al metodo getImage()")
    const userId = this.local.getUserId();
    this.imageService.getImageByUserId(userId!).subscribe(
      response => {
        this.image = response; // Asigna los datos de la imagen
        console.log("Respuesta getImage(): ", response);

        // Aquí asumimos que tienes acceso a los datos de la imagen
        const imageDataBase64 = response.imageData;

        // Decodificar los datos base64 en un ArrayBuffer
        const arrayBuffer = this.base64ToArrayBuffer(imageDataBase64);

        // Crear un blob a partir del ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: response.imageType });

        // Crear una URL de objeto para el blob
        this.imageUrl = URL.createObjectURL(blob);


      },
      error => {
        console.error('Failed to get image:', error);
      }
    );
  }

  // Función para convertir una cadena base64 en un ArrayBuffer
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

}

