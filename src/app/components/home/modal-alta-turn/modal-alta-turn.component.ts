import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PatientResponse } from 'src/app/models/response/patient-response';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { TurnService } from 'src/app/services/turn.service';
import { ModalServiceService } from 'src/app/shared/services/modal-service.service';
import { TurnUpdateService } from 'src/app/shared/services/turn-update.service';

@Component({
  selector: 'app-modal-alta-turn',
  templateUrl: './modal-alta-turn.component.html',
  styleUrl: './modal-alta-turn.component.css'
})
export class ModalAltaTurnComponent implements OnInit, OnDestroy {

  public visible: boolean = false;
  patientResults: PatientResponse[] = [];
  searchTerm: string = '';
  fecha!: Date;
  hora!: string;
  centro!: string;
  loading: boolean = false;
  turnCreate: boolean = false;

  constructor(private modalService: ModalServiceService,
              private cdr: ChangeDetectorRef,
              private patientService: PatientService,
              private turnService: TurnService,

              private turnUpdateService: TurnUpdateService,
              private localService: LocalAuthService
  ) { }


  ngOnInit(): void {
    this.modalService.modalVisible$.subscribe((visible) => {
      this.visible = visible;
      this.reinicializarFlowBite();
    });
    this.reinicializarFlowBite();
    // Suscríbete a las propiedades del servicio para obtener los datos
    this.modalService.fecha$.subscribe(fecha => {
      // Verifica si fecha no es null antes de asignar
      this.fecha = fecha !== null ? fecha : new Date();
      console.log("Fecha recibida del servicio compartido: " + fecha);
    });
    this.modalService.hora$.subscribe(hora => this.hora = hora);
    this.modalService.centro$.subscribe(centro => this.centro = centro);
    this.searchPatient()
  }

  ngOnDestroy(): void {
    this.closeDialog();
     // Desuscribirse de todas las suscripciones al servicio de modal aquí
    // Esto asegurará que no haya fugas de memoria ni llamadas innecesarias a los modales
    this.turnUpdateService.unsubscribeAll();
  }

  public closeDialog(): void {
    this.modalService.hideModal();
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  public onSearchTermChange() {
      this.searchPatient();
  }

  public searchPatient() {
    console.log("Se apretó el botón searchPatient");
    const userId = this.localService.getUserId();

    // Siempre limpiamos los resultados anteriores cuando el término de búsqueda está vacío
    if (this.searchTerm === '') {
      this.patientResults = [];
    }

    // Realizamos la búsqueda si hay al menos 3 caracteres o más, o si el término de búsqueda está vacío
    if (this.searchTerm.length >= 3  ) {
      // this.loading = true;

      this.patientService.searchPatient(this.searchTerm, userId!).subscribe(
        response => {
          this.patientResults = response;
          console.log(response);

        },
        err => {
          console.log(err);
          this.loading = false;
        }
      );
      this.patientResults = [];
    }
  }



  addTurnPatient(dni: string) {
    console.log("Entró al método addTurnPatient");
    //console.log("Metodo addTurnPatient " + this.centro)
    if (!this.centro) {
      // Maneja la falta del centro aquí, puedes mostrar un mensaje o lanzar una excepción según tus necesidades.
      console.error('El centro no está definido.');
      return;
    }
    const dateToSend = this.fecha; // Tu objeto de fecha

    const year = dateToSend.getFullYear();
    const month = (dateToSend.getMonth() + 1).toString().padStart(2, '0'); // Los meses son de 0 a 11
    const day = dateToSend.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const centro = this.centro;
    const userId = this.localService.getUserId();
    //console.log("Fecha dentro del metodo agregar turno: " + formattedDate);
    //const date = this.fecha;
    const hour = this.hora;
    this.turnService.createPatientTurn(centro, formattedDate, hour, dni, userId!).subscribe(response => {
      console.log(response);
      // this.toast.success(response.message);
      this.turnUpdateService.notifyTurnAdded();
      this.turnCreate = true;
      setTimeout(() => {
        this.patientResults = [];
        this.searchTerm = '';
        this.closeDialog();
      },1000)
    },
      error => {
        this.patientResults = [];
        // this.toast.error(error.error);
        console.log(error)
      }
    )

    // console.log("Fecha: " + this.fecha + " Hora: " + this.hora + "Centro: " + this.centro);
    // console.log('DNI Paciente seleccionado:', dni);
  }
  // Función para formatear la fecha en "YYYY-MM-DD"
  private formatDate(fecha: Date): Date {
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1; // Los meses son de 0 a 11
    const day = fecha.getDate();

    return new Date(year, month - 1, day); // Resta 1 al mes ya que es de 0 a 11
  }

}
