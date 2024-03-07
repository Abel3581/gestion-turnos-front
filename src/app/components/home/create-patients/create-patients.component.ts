import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PatientRequest } from 'src/app/models/request/patient-request';
import { ImageResponse } from 'src/app/models/response/image-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { TotalCentrosService } from 'src/app/services/compartidos/total-centros.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-create-patients',
  templateUrl: './create-patients.component.html',
  styleUrl: './create-patients.component.css'

})
export class CreatePatientsComponent implements OnInit {
  totalCentros: number = 0;
  formAltaPatient!: FormGroup;
  iconSeleccionado: string = '';
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalPatients: number = 0;
  totalAgendas: number = 0;
  mostrarToastSuccess: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;


  constructor(private router: Router,
              private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private patientService: PatientService,
              private local: LocalAuthService,
              private totalCentersService: TotalCentrosService,
              private centerService: HealthCenterService,
              private toastService: ToastService,
              private imageService: ImageService
              ) {
    this.formAltaPatient = fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8,}$/)]],
      cellphone: ['', Validators.required],
      genre: [''],
      dateOfBirth: [''],
      nationality: [''],
      address: [''],
      healthInsurance: [''],
      plan: [''],
      affiliateNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      profession: [''],
      province: [''],
      landline: [''],
      age: ['', [Validators.required]]

    });

  }

  get dniControl() {
    return this.formAltaPatient.get('dni');
  }
  get emailControl() {
    return this.formAltaPatient.get('email');
  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.totalCentersService.totalCentros$.subscribe((value) => {
      this.totalCentros = value;
      console.log("Cantidad de centros: " , value);
    });
    const userId = this.local.getUserId();
    this.patientService.getTotalPatientsByUserId(userId!).subscribe(
      total => {
        this.totalPatients = total;
      },
      error => {
        console.log(error);
      }
    );
    this.centerService.totalCentersByUser(userId!).subscribe(
      total => {
        this.totalAgendas = total;
      }
    );
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    this.getImage();

    this.reinicializarFlowBite();

  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  public createPatient() {
    console.log("Se apreto el boton createPatient()");
    const userId = this.local.getUserId();
    const request: PatientRequest = this.formAltaPatient.value;
    console.log("Entrando al createPatient() en el TS");
    console.log("UserId = ", userId, "Request = ", request);
    if (this.formAltaPatient.valid && userId != null) {
      console.log("Formulario validado")
      this.patientService.createPatient(userId!, request).subscribe(
        response => {
          console.log("Paciente creado")
          console.log(response);
          this.mostrarToastSuccess = true;
          this.mensajeToast = response.message;
          this.patientService.getTotalPatientsByUserId(userId!).subscribe(
            total => {
              this.totalPatients = total;
            },
            error => {
              console.log(error);
            }
          );

        },
        err => {
          this.mostrarToastDander = true;
          this.mensajeToast = err.error;
          console.error('Error en el componente:', err);

          // Puedes acceder a la propiedad 'error' para obtener detalles específicos del error
          if (err.error && err.error.dni) {
            // this.tostr.error(err.error.dni);
            this.mostrarToastDander = true;
            this.mensajeToast = err.error.dni;
            console.error('Detalles específicos del error:', err.error.dni);
          }
        }

      )
    } else {
      this.formAltaPatient.markAllAsTouched();

    }
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
