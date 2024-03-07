import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PatientRequest } from 'src/app/models/request/patient-request';
import { ImageResponse } from 'src/app/models/response/image-response';
import { Page } from 'src/app/models/response/page';
import { PatientPageResponse } from 'src/app/models/response/patient-page-response';
import { PatientResponse } from 'src/app/models/response/patient-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patients-center',
  templateUrl: './patients-center.component.html',
  styleUrl: './patients-center.component.css'
})
export class PatientsCenterComponent implements OnInit {

  centerName: string = '';
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  patientsPage!: Page<PatientPageResponse>;
  page = 0;
  size = 4;
  formUpdatePatient!: FormGroup;
  patient!: PatientPageResponse;
  patientId!: number;
  mostrarToastSuccess: boolean = false;
  mensajeToast: string = '';
  mostrarToastDander: boolean = false;
  searching: boolean = false;
  searchTerm: string = '';
  patients: PatientPageResponse[] = [];
  image!: ImageResponse;
  imageUrl: string | undefined;

  constructor(private local: LocalAuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private patientService: PatientService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private centerService: HealthCenterService,
    private imageService: ImageService
  ) {
    this.formUpdatePatient = fb.group({
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
    return this.formUpdatePatient.get('dni');
  }
  get emailControl() {
    return this.formUpdatePatient.get('email');
  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.route.params.subscribe(params => {
      const centerName = params['centerName'];
      this.centerName = centerName;
      console.log("Centro de pacienteComponent: " + centerName);
    });

    this.getPatientsPage();
    if (this.patientId != null) {
      this.buscarPacienteId(this.patientId);
    }
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    this.getImage();

  }

  public getPatientsPageByTerm() {
    const userId = this.local.getUserId();
    const center = this.centerName;
    const term = this.searchTerm;
    if (term.length == 1) {
      this.patientsPage.content = [];
      // this.patientsPage.size = 0
      this.searching = true;
      setTimeout(() => {
        this.searching = false;
      }, 100)
      this.reinicializarFlowBite();
    }
    if (term.length == 0) {
      this.getPatientsPage();
    }
    if (term.length >= 3) {
      console.log
      this.patientService.getPatientsPageByTerm(userId!, center, term, this.page, this.size).subscribe(
        response => {
          console.log(response);
          this.patientsPage = response;
          this.searching = true;
          setTimeout(() => {
            this.searching = false;
          }, 2000);
          this.reinicializarFlowBite();
        },
        error => {
          console.log(error);
        }
      )
    }

  }

  public getPatientsPage() {
    const userId = this.local.getUserId();
    const center = this.centerName;
    console.log("GetPatientPage: " + userId + this.centerName);
    this.patientService.getPatientsPage(userId!, center, this.page, this.size).subscribe(
      response => {
        this.patientsPage = response;
        console.log(response.content);
        console.log("Paginas: ", response);
        this.reinicializarFlowBite();
      },
      error => {
        console.log(error);
      }
    )
  }

  public onPageChange(page: number) {
    this.page = page;
    this.getPatientsPage();
  }
  // Método para obtener el total de páginas
  public getTotalPages(): number[] {
    if (this.patientsPage) {
      const totalPages = this.patientsPage.totalPages;
      return Array.from({ length: totalPages }, (_, index) => index);
    }
    return [];
  }

  public getTotalPagesToShow(): number[] {
    const totalPages = this.patientsPage.totalPages;
    const currentPage = this.page;
    const visiblePages = 5; // Define cuántas páginas quieres mostrar alrededor de la actual

    let startPage: number;
    let endPage: number;

    if (totalPages <= visiblePages) {
      // Si el total de páginas es menor o igual a las páginas visibles, mostramos todas las páginas
      startPage = 0;
      endPage = totalPages - 1;
    } else {
      // Calculamos el rango de páginas para mostrar alrededor de la página actual
      const halfVisiblePages = Math.floor(visiblePages / 2);
      if (currentPage - halfVisiblePages <= 0) {
        // Si la página actual está cerca del inicio, mostramos desde la página 0
        startPage = 0;
        endPage = visiblePages - 1;
      } else if (currentPage + halfVisiblePages >= totalPages) {
        // Si la página actual está cerca del final, mostramos desde la página final
        startPage = totalPages - visiblePages;
        endPage = totalPages - 1;
      } else {
        // Mostramos el rango de páginas alrededor de la página actual
        startPage = currentPage - halfVisiblePages;
        endPage = currentPage + halfVisiblePages;
        // Ajustamos el rango si se sale de los límites
        if (endPage - startPage < visiblePages - 1) {
          endPage = startPage + visiblePages - 1;
        }
      }
    }

    // Aseguramos que las páginas a mostrar estén dentro de los límites
    startPage = Math.max(startPage, 0);
    endPage = Math.min(endPage, totalPages - 1);

    // Generamos un arreglo con las páginas a mostrar
    const pagesToShow = [];
    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    return pagesToShow;
  }


  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  public buscarPacienteId(patientId: number) {
    if (patientId != null) {
      this.patientId = patientId;
      console.log(this.patientId);
      const userId = this.local.getUserId();
      this.patientService.getPatientByIdAndUserId(patientId, userId!).subscribe(
        response => {
          console.log("Paciente", response);
          this.patient = response;
          // Llena los valores del paciente en el formulario
          this.formUpdatePatient.patchValue({
            name: this.patient.name,
            surname: this.patient.surname,
            dni: this.patient.dni,
            cellphone: this.patient.cellphone,
            genre: this.patient.genre,
            dateOfBirth: this.patient.dateOfBirth,
            nationality: this.patient.nationality,
            address: this.patient.address,
            healthInsurance: this.patient.healthInsurance,
            plan: this.patient.plan,
            affiliateNumber: this.patient.affiliateNumber,
            email: this.patient.email,
            profession: this.patient.profession,
            province: this.patient.province,
            landline: this.patient.landline,
            age: this.patient.age
          });
          this.reinicializarFlowBite();
        },
        error => {
          console.log(error);
        }
      )
    } else
      return;

  }

  public updatePatient() {
    const userId = this.local.getUserId();
    console.log("Paciente variable global: " + this.patientId);
    // Obtener los valores del formulario
    const formData = this.formUpdatePatient.value;
    // Crear una instancia de PatientRequest con los datos del formulario
    const request: PatientRequest = {
      name: formData.name,
      surname: formData.surname,
      dni: formData.dni,
      cellphone: formData.cellphone,
      genre: formData.genre,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      address: formData.address,
      healthInsurance: formData.healthInsurance,
      plan: formData.plan,
      affiliateNumber: formData.affiliateNumber,
      email: formData.email,
      profession: formData.profession,
      province: formData.province,
      landline: formData.landline,
      age: formData.age
    };
    if(this.formUpdatePatient.valid){
      this.patientService.updatePatient(this.patientId, userId!, request).subscribe(
        response => {
          console.log(response);
          this.mostrarToastSuccess = true;
          this.mensajeToast = response.message;
          this.reinicializarFlowBite();
        },
        error => {
          console.log(error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error.message;
        }
      );
    }else {
      this.formUpdatePatient.markAsTouched();
    }

  }

  public patientsFilters() {
    const userId = this.local.getUserId();
    const term = this.searchTerm;
    if (term.length == 1) {
      this.patients = [];

    }
    if (term.length >= 3) {
      this.patientService.filtersPatients(term, userId!).subscribe(
        response => {
          console.log(response);
          this.patients = response;
          this.searching = true;

          // Simulación de búsqueda durante 2 segundos
          setTimeout(() => {
            // Después de 2 segundos, detiene la búsqueda y oculta el spinner
            this.searching = false;
          }, 2000);
          this.reinicializarFlowBite();

        },
        error => {
          console.error(error);
        }
      )
    }
  }

  deletePatientBy(patientId: number) {
    console.log("Entrando al metodo deletePatientBy()");
    const userId = this.local.getUserId();
    const centerName = this.centerName;
    // llamo al servicio del center
    this.centerService.deletePatientByCenter(userId!, centerName, patientId).subscribe(
      response => {
        console.log(response);
        this.mostrarToastSuccess = true;
        this.mensajeToast = response.message;
        this.getPatientsPage();
      },
      error => {
        console.error(error);
        this.mostrarToastDander = true;
        this.mensajeToast = error.error.message;
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
