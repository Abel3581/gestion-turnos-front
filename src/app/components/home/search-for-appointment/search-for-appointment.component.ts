import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { ImageResponse } from 'src/app/models/response/image-response';
import { TurnResponse } from 'src/app/models/response/turn-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { TurnService } from 'src/app/services/turn.service';

@Component({
  selector: 'app-search-for-appointment',
  templateUrl: './search-for-appointment.component.html',
  styleUrl: './search-for-appointment.component.css'
})
export class SearchForAppointmentComponent implements OnInit {
  dni: string = "";
  fecha: string = "Todos"; // Valor por defecto
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalPatiens: number = 0;
  totalAgendas: number = 0;
  image!: ImageResponse;
  imageUrl: string | undefined;
  searchFormTurn!: FormGroup;
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  mostrarToastDander: boolean = false;
  mostrarToastInfo: boolean = false;
  turns: TurnResponse[] = [];
  searching: boolean = false;

  constructor(private imageService: ImageService,
    private local: LocalAuthService,
    private centers: HealthCenterService,
    private patientService: PatientService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private turnService: TurnService,
    private toastService: ToastService,

  ) {
    this.searchFormTurn = fb.group({
      dni: ['']
    });
  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
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
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastInfo = false;
    });
    this.getImage();

    // Escucha cambios en el campo dni
    this.searchFormTurn.get('dni')?.valueChanges.subscribe((value: string) => {
      if (value.length >= 3) {
        this.searchTurnsByDateAndDniFilters();
      }
    })
    this.reinicializarFlowBite();
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

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  searchTurns() {
    this.mensajeToast = "";
    this.dni = "";
    console.log("Entrando al metodo searchTurns()");
    console.log("Fecha: ", this.fecha);
    console.log("Dni: ", this.searchFormTurn.value.dni);
    const dni = this.searchFormTurn.value.dni;
    const date = this.fecha;
    const userId = this.local.getUserId();
    if (!dni || dni.trim().length === 0) { // Verifica si el DNI está vacío o es nulo
      this.mostrarToastInfo = true;
      this.mensajeToast = "Ingresa un DNI";
      this.reinicializarFlowBite();
      return;
    }

    this.turnService.searchTurnsByDateAndDni(date, dni, userId!).subscribe(
      response => {
        console.log(response);
        this.turns = response;
        this.searching = true;

        // Simulación de búsqueda durante 2 segundos
        setTimeout(() => {
          // Después de 2 segundos, detiene la búsqueda y oculta el spinner
          this.searching = false;
        }, 2000);
        this.reinicializarFlowBite();
        this.searchFormTurn.reset();
      },
      error => {
        if (error.status === 404) {
          console.log(error.error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error;
        }
        if (error.status === 400) {
          console.log(error.error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error;
        }
        if (error.status != 400 && error.status != 404) {
          console.log(error.error.message);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error.message;
        }

        this.searchFormTurn.reset();
      }
    )

  }

  searchTurnsByDateAndDniFilters() {
    this.mensajeToast = "";
    this.dni = "";
    console.log("Entrando al metodo searchTurns()");
    console.log("Fecha: ", this.fecha);
    console.log("Dni: ", this.searchFormTurn.value.dni);
    const dni = this.searchFormTurn.value.dni;
    const date = this.fecha;
    const userId = this.local.getUserId();
    if (!dni || dni.trim().length === 0) { // Verifica si el DNI está vacío o es nulo
      this.mostrarToastInfo = true;
      this.mensajeToast = "Ingresa un DNI";
      this.reinicializarFlowBite();
      return;
    }
    this.turnService.searchTurnsByDateAndDniFilters(date, dni, userId!).subscribe(
      response => {
        this.turns = response;
        this.searching = true;
        console.log(response);
        setTimeout(() => {
          this.searching = false;
        },1500);
        this.reinicializarFlowBite();
        this.searchFormTurn.reset();
      },
      error => {
        if (error.status === 404) {
          console.log(error.error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error;
        }
        if (error.status === 400) {
          console.log(error.error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error;
        }
        if (error.status != 400 && error.status != 404) {
          console.log(error.error.message);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error.message;
        }

        this.searchFormTurn.reset();
      }
    )

  }

}
