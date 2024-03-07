import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HealthCenterResponse } from 'src/app/models/response/health-center-response';
import { ImageResponse } from 'src/app/models/response/image-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { TotalCentrosService } from 'src/app/services/compartidos/total-centros.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-health-center',
  templateUrl: './health-center.component.html',
  styleUrls: ['./health-center.component.css']
})
export class HealthCenterComponent implements OnInit, AfterViewInit {

  mostrarToastSuccess: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;
  iconSeleccionado: string = '';
  formGroup!: FormGroup;
  liSeleccionado: string = "";
  display: boolean = false;
  visible: boolean = false;
  centers: HealthCenterResponse[] = [];
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalCentros: number = 0;
  totalPatients: number = 0;
  totalAgendas: number = 0;
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,
    private centerService: HealthCenterService,
    private local: LocalAuthService,
    private userService: UserService,
    private zone: NgZone,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private totalCentersService: TotalCentrosService,
    private patientService: PatientService,
    private toastService: ToastService,
    private imageService: ImageService
    ) {
    this.formGroup = fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required]

    });

  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.getAllCenters();
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
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    this.getImage();
    this.reinicializarFlowBite();

  }

  ngAfterViewInit(): void {
    this.reinicializarFlowBite();
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  public showDialog() {
    this.visible = true;
  }

  public modalClose() {
    this.visible = false;
  }

  public seleccionarLi(li: string): void {
    this.liSeleccionado = li;
  }

  public createCenter() {
    if (this.formGroup.valid) {
      const userId = this.local.getUserId();
      const request = this.formGroup.value;
      console.log("UserId: en createCenter():" + userId);
      this.centerService.createCenter(userId!, request).subscribe(
        response => {
          console.log(response.message);
          this.mostrarToastSuccess = true;
          this.mensajeToast = response.message;
          this.formGroup.reset();
          setTimeout(() => {
            this.modalClose();
          },1000)
          // Después de crear el centro, actualiza la lista de centros
          this.zone.run(() => {
            this.getAllCenters();
          });
        },
        err => {
          console.log(err.error);
          this.mostrarToastDander = true;
          this.mensajeToast = "No se oudo crear el centro"
          // this.tostr.error(err.error);
        }
      )

    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  public getAllCenters() {
    const userId = this.local.getUserId();
    if (userId != null) {
      this.userService.getAllCenterForUser(userId).subscribe(
        response => {
          console.log("Centros: ", response);
          this.centers = response;
          this.totalCentros = response.length;
          this.totalCentersService.setTotalCentros(response.length);
          console.log("Total Centros: " , this.totalCentros);

          this.reinicializarFlowBite();
        },
        err => {
          console.log(err.error);

        }
      )
    }
  }

  public deletedCenterBy(centerId: number) {
    console.log("Ingresando al metodo deletedCenterBy()");
    if(centerId != null){
      this.centerService.deleteCenterById(centerId).subscribe(
        response => {
          console.log(response);
          this.mostrarToastSuccess = true;
          this.mensajeToast = response.message;
          this.getAllCenters();
          this.centerService.totalCentersByUser(this.local.getUserId()!).subscribe(
            total => {
              this.totalAgendas = total;
            }
          );

        },
        error => {
          console.log(error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error.mensaje;
        }
      )
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
