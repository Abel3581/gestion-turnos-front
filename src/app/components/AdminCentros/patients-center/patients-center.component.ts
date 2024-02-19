import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PatientRequest } from 'src/app/models/request/patient-request';
import { Page } from 'src/app/models/response/page';
import { PatientPageResponse } from 'src/app/models/response/patient-page-response';
import { PatientResponse } from 'src/app/models/response/patient-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
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
  mostrarToast: boolean = false;
  mensajeToast: string = '';
  mostrarToastDander: boolean = false;

  constructor(private local: LocalAuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private patientService: PatientService,
    private fb: FormBuilder,
    private toastService: ToastService
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
      landline: ['']
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
      this.mostrarToast = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });


  }

  getPatientsPage() {
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

  onPageChange(page: number) {
    this.page = page;
    this.getPatientsPage();
  }
  // Método para obtener el total de páginas
  getTotalPages(): number[] {
    if (this.patientsPage) {
      const totalPages = this.patientsPage.totalPages;
      return Array.from({ length: totalPages }, (_, index) => index);
    }
    return [];
  }

  getTotalPagesToShow(): number[] {
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

  buscarPacienteId(patientId: number) {
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
          landline: this.patient.landline
        });
        },
        error => {
          console.log(error);
        }
      )
    } else
      return;

  }

  updatePatient(){
    const userId = this.local.getUserId();
    console.log("Paciente variable global: " +  this.patientId);
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
     landline: formData.landline
   };
   this.patientService.updatePatient(this.patientId, userId!, request).subscribe(
    response => {
      console.log(response);
    },
    error => {
      console.log(error);
    }
   )
  }

}
