import { useAnimation } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ConsultationRequest } from 'src/app/models/request/consultation-request';
import { ClinicHistoryResponse } from 'src/app/models/response/clinic-history-response';
import { ImageResponse } from 'src/app/models/response/image-response';
import { PatientPageResponse } from 'src/app/models/response/patient-page-response';
import { ClinicHistoryServiceService } from 'src/app/services/clinic-history-service.service';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrl: './patient-record.component.css'
})
export class PatientRecordComponent implements OnInit, AfterViewInit {
  formCreateHistory: FormGroup;
  centerName: string = '';
  patientId: number = 0;
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  mostrarToastSuccess: boolean = false;
  mensajeToast: string = '';
  mostrarToastDander: boolean = false;
  clinics: ClinicHistoryResponse[] = [];
  patient!: PatientPageResponse;
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;


  constructor(private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private clinicService: ClinicHistoryServiceService,
    private localService: LocalAuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private patientService: PatientService,
    private imageService: ImageService,
    private local: LocalAuthService

  ) {
    this.formCreateHistory = formBuilder.group({
      localDate: ['', Validators.required],
      reasonForConsultation: ['', Validators.required],
      background: [''],
      physicalExam: [''],
      complementaryStudies: [''],
      observations: ['']

    })
  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.route.params.subscribe(params => {
      this.centerName = params['centerName'];
      this.patientId = params['patientId'];

      console.log("Centro de paciente-recordComponent: " + this.centerName);
      console.log("IdPaciente de paciente-recordComponent: " + this.patientId);
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    this.getPatientById();
    this.getAllClinicHistory();
    this.getImage();
    this.reinicializarFlowBite();
    // console.log(this.formCreateHistory.valid);
  }

  ngAfterViewInit(): void {
    console.log("patientId: ", this.patientId);
    console.log("CenterName: ", this.centerName);
    //this.getAllClinicHistory();
    //this.getPatientById();
  }

  addClinicHistory() {
    if (this.formCreateHistory.valid) {
      console.log("Se apreto el boton agregar historia clinica");
      const patientId = this.patientId;
      const userId = this.localService.getUserId();
      const centerName = this.centerName;
      console.log("Centro en addClinicHistory: " + centerName);

      // Crear un nuevo objeto ConsultationRequest y asignar valores individualmente
      const request: ConsultationRequest = {
        localDate: this.formCreateHistory.get('localDate')?.value,
        reasonForConsultation: this.formCreateHistory.get('reasonForConsultation')?.value,
        background: this.formCreateHistory.get('background')!.value,
        physicalExam: this.formCreateHistory.get('physicalExam')!.value,
        complementaryStudies: this.formCreateHistory.get('complementaryStudies')!.value,
        observations: this.formCreateHistory.get('observations')!.value,
        centerName: centerName
      };

      console.log("Entrando al metodo addClinicHistory");
      this.clinicService.addClinicHistory(patientId, userId!, request).subscribe(
        response => {
          console.log(response);
          // Mostrar un mensaje de éxito al usuario
          this.mostrarToastSuccess = true;
          this.mensajeToast = 'Historia clínica agregada con éxito';
          setTimeout(() => {
            this.getAllClinicHistory();
            this.reinicializarFlowBite();
          });
          // Reiniciar el formulario
          this.formCreateHistory.reset();

        },
        error => {
          console.log(error);
          // Mostrar un mensaje de error al usuario
          this.mostrarToastDander = true;
          this.mensajeToast = 'Error al agregar la historia clínica. Por favor, inténtelo de nuevo más tarde.';
        }
      )
    } else {
      console.log(this.formCreateHistory)
      this.formCreateHistory.markAllAsTouched();
    }
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  public getAllClinicHistory(){
    const patientId = this.patientId;
    const centerName = this.centerName;
    this.clinicService.getAllClinicHistory(patientId, centerName).subscribe(
      response => {
        console.log(response);
        this.clinics = response;
      },
      error => {
        console.log(error);
      }
    )
  }

  public deletedClinicHistory(id: number){
    console.log("ClinicHistoryId: ", id);
    if(id != null){
      this.clinicService.deletedClinicHistory(id).subscribe(
        response => {
          console.log(response);
          this.getAllClinicHistory();
        },
        error => {
          console.error(error);
        }
      )
    }
  }

  public getPatientById(){
    const patientId = this.patientId;
    if(patientId != null){
      this.patientService.getPatientById(patientId).subscribe(
        response => {
          console.log("Paciente", response);
          this.patient = response;
        },
        error => {
          console.log(error);
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
