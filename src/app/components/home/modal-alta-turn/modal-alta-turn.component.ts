import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { PatientResponse } from 'src/app/models/response/patient-response';
import { PatientService } from 'src/app/services/patient.service';
import { TurnService } from 'src/app/services/turn.service';
import { ModalServiceService } from 'src/app/shared/services/modal-service.service';
import { TurnUpdateService } from 'src/app/shared/services/turn-update.service';

@Component({
  selector: 'app-modal-alta-turn',
  templateUrl: './modal-alta-turn.component.html',
  styleUrl: './modal-alta-turn.component.css'
})
export class ModalAltaTurnComponent implements OnInit {

  public visible: boolean = false;
  patientResults: PatientResponse[] = [];
  searchTerm: string = '';
  fecha!: Date;
  hora!: string;
  centro!: string;
  loading: boolean = false;

  constructor(private modalService: ModalServiceService, private cdr: ChangeDetectorRef,
    private patientService: PatientService, private turnService: TurnService, private toast: ToastrService,
    private turnUpdateService: TurnUpdateService) { }

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

  onSearchTermChange() {
    // Llama a tu función de búsqueda aquí
    this.searchPatient();
  }

  public searchPatient() {
    console.log("Se apreto el boton searchPatient")
    // console.log("ModalComponente Fecha: " + this.fecha + " hora: " + this.hora + " Centro: " + this.centro);
    if (this.searchTerm.length >= 3) {
      this.loading = true;
      // Resto de tu lógica aquí
      setTimeout(() => {
        this.loading = false;
      },1000)
      this.patientService.searchPatient(this.searchTerm).subscribe(
        response => {
          this.patientResults = response;
          console.log(response);

        },
        err => {
          console.log(err);
        }
      )
    }
    if (this.searchTerm.length === 0) {
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
    //console.log("Fecha dentro del metodo agregar turno: " + formattedDate);
    //const date = this.fecha;
    const hour = this.hora;
    this.turnService.createPatientTurn(centro, formattedDate, hour, dni).subscribe(response => {
      console.log(response);
      this.toast.success(response.message);
      this.turnUpdateService.notifyTurnAdded();
      setTimeout(() => {
        this.closeDialog();
      },1000)
    },
      error => {
        this.toast.error(error.error);
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
