import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { initFlowbite } from "flowbite";
import { filter } from "rxjs";
import { HealthCenterNamesResponse } from "src/app/models/response/health-center-names-response";
import { HealthCenterResponse } from "src/app/models/response/health-center-response";
import { PatientPageResponse } from "src/app/models/response/patient-page-response";
import { ToastService } from "src/app/services/compartidos/toast.service";
import { HealthCenterService } from "src/app/services/health-center.service";
import { LocalAuthService } from "src/app/services/local-auth.service";
import { PatientService } from "src/app/services/patient.service";
import { Chart } from 'chart.js';
import { GetTotalGendersResponse } from "src/app/models/response/get-total-genders-response";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientRequest } from "src/app/models/request/patient-request";
import { TurnService } from "src/app/services/turn.service";


@Component({
  selector: 'app-view-patients',
  templateUrl: './view-patients.component.html',
  styleUrl: './view-patients.component.css'
})
export class ViewPatientsComponent implements OnInit {

  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalPatiens: number = 0;
  totalAgendas: number = 0;
  mostrarToastSuccess: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;
  centersName: HealthCenterNamesResponse[] = [];
  selectedCenterName: string = '';
  searchTerm: string = ''; // Variable para almacenar el término de búsqueda
  patients: PatientPageResponse[] = [];
  dropdownOpen: boolean = false;
  searching: boolean = false; // Variable para controlar la visibilidad del spinner
  totalGenders!: GetTotalGendersResponse;
  patientId!: number;
  formUpdatePatient!: FormGroup;
  patient!: PatientPageResponse;



  constructor(private patientService: PatientService,
    private centers: HealthCenterService,
    private local: LocalAuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private turnService: TurnService
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
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    this.getTotalGenders();
    this.getAlCentersByUserId();
    this.searchPatientsByCenterNameAndUser();
    if (this.patientId != null) {
      this.buscarPacienteId(this.patientId);
    }
    setTimeout(() => {
      if (this.totalGenders) {
        this.createGrafic();
      }
    }, 1000);

    this.reinicializarFlowBite();
  }

  public getTotalGenders() {
    const userId = this.local.getUserId();
    this.patientService.getTotalGenders(userId!).subscribe(
      response => {
        console.log(response);
        this.totalGenders = response;
      },
      error => {
        console.error(error);
      }
    )
  }

  public createGrafic() {
    // Datos de ejemplo para el gráfico (número de pacientes por género)
    const genderData = {
      labels: ['Hombre', 'Mujer', 'Transgénero'],
      datasets: [{
        data: [this.totalGenders.totalMale, this.totalGenders.totalFemale,
        this.totalGenders.totalTransgender], // Aquí deberías reemplazar estos valores con los datos reales
        backgroundColor: [
          'rgba(255, 69, 96, 0.5)', // Color para hombre (rojo más oscuro)
          'rgba(24, 119, 194, 0.5)', // Color para mujer (azul más oscuro)
          'rgba(255, 180, 0, 0.5)' // Color para transgénero (amarillo más oscuro)
        ],
        borderColor: [
          'rgba(255, 69, 96, 1)', // Color para hombre (rojo más oscuro)
          'rgba(24, 119, 194, 1)', // Color para mujer (azul más oscuro)
          'rgba(255, 180, 0, 1)' // Color para transgénero (amarillo más oscuro)
        ],

        borderWidth: 1
      }]
    };

    // Configuración del gráfico
    const genderChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };

    // Crear el gráfico
    const genderChart = new Chart('genderChart', {
      type: 'pie',
      data: genderData,
      options: genderChartOptions
    });
  }

  public getAlCentersByUserId() {
    const userId = this.local.getUserId();
    if (userId != null) {
      this.centers.getAllCentersName(userId).subscribe(
        response => {
          console.log("Centros para idUser: ", userId, response);
          this.centersName = response;
        },
        error => {
          console.error(error);
        }
      )
    }

  }


  selectCenter(centerName: string, event: Event): void {
    event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
    this.selectedCenterName = centerName;
    this.dropdownOpen = false; // Cierra el menú desplegable
    this.searchPatientsByCenterNameAndUser();
    this.searchTerm = "";


  }

  search(): void {
    if (!this.selectedCenterName) {
      // No hacer nada si no se ha seleccionado un centro
      return;
    }
    const userId = this.local.getUserId();
    const centerName = this.selectedCenterName;
    const term = this.searchTerm;
    console.log("search()" + userId + centerName + term);
    if (this.selectedCenterName && term.length === 0) {
      this.patientService.searchPatients(centerName, userId!, term).subscribe(
        response => {

          console.log(response);
          this.patients = response;
          this.reinicializarFlowBite();

        },
        error => {
          console.error(error);
        }
      )
    }
    if (this.selectedCenterName && term.length >= 3) {
      this.patientService.searchPatients(centerName, userId!, term).subscribe(
        response => {
          console.log(response);
          this.patients = response;
          this.reinicializarFlowBite();
        },
        error => {
          console.error(error);
        }
      )
    }

  }

  buscarPacienteId(patientId: number) {
    console.log("Se apreto el boton actualizar paciente")
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

  updatePatient() {
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
    this.patientService.updatePatient(this.patientId, userId!, request).subscribe(
      response => {
        console.log(response);
        this.mostrarToastSuccess = true;
        this.mensajeToast = response.message;
        this.searchPatientsByCenterNameAndUser();
        this.reinicializarFlowBite();
      },
      error => {
        console.log(error);
        this.mostrarToastDander = true;
        this.mensajeToast = error.error.message;
      }
    )
  }

  public searchPatientsByCenterNameAndUser() {
    const userId = this.local.getUserId();
    let centerName = this.selectedCenterName;
    if (centerName === '') {
      centerName = "Todos";
    }
    this.patientService.searchPatientsByCenterNameAndUser(centerName, userId!).subscribe(
      response => {
        console.log(response);
        this.patients = response;
        this.reinicializarFlowBite();
      },
      error => {
        console.error(error);
      }
    )
  }

  public patientsFilters() {
    const userId = this.local.getUserId();
    const term = this.searchTerm;
    if (term.length == 1) {
      this.patients = [];
      this.selectedCenterName = "";
    }
    if (term.length == 0) {
      this.searchPatientsByCenterNameAndUser();
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

  deletePatientById(patientId: number) {
    console.log("Entrando al metodo deletePatientById()");
    this.turnService.deletePatient(patientId).subscribe(
      response => {
        console.log(response);
        this.mostrarToastSuccess = true;
        this.mensajeToast = response.message;
        this.searchPatientsByCenterNameAndUser();
        this.patientService.getTotalPatientsByUserId(this.local.getUserId()!).subscribe(
          total => {
            this.totalPatiens = total;
          }
        );
      },
      error => {
        console.log(error);

      }
    )

  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

}
