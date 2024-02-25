import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { initFlowbite } from "flowbite";
import { HealthCenterNamesResponse } from "src/app/models/response/health-center-names-response";
import { HealthCenterResponse } from "src/app/models/response/health-center-response";
import { PatientPageResponse } from "src/app/models/response/patient-page-response";
import { ToastService } from "src/app/services/compartidos/toast.service";
import { HealthCenterService } from "src/app/services/health-center.service";
import { LocalAuthService } from "src/app/services/local-auth.service";
import { PatientService } from "src/app/services/patient.service";


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
  mostrarToast: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;
  centersName: HealthCenterNamesResponse[] = [];
  selectedCenterName: string = '';
  searchTerm: string = ''; // Variable para almacenar el término de búsqueda
  patients: PatientPageResponse[] = [];

  constructor(private patientService: PatientService,
    private centers: HealthCenterService,
    private local: LocalAuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {

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

    this.getAlCentersByUserId();
    this.searchPatientsByCenterNameAndUser();
    this.reinicializarFlowBite();

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
    this.search();

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
    if(this.selectedCenterName && term.length >= 3){
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

  buscarPacienteId(arg0: number) {
    console.log("Se apreto el boton actualizar paciente")
  }

  public searchPatientsByCenterNameAndUser(){
    const userId = this.local.getUserId();
    let centerName = this.selectedCenterName;
    if(centerName === ''){
      centerName = "Todos";
    }
    this.patientService.searchPatientsByCenterNameAndUser(centerName, userId!).subscribe(
      response => {
        console.log(response);
        this.patients = response;
      },
      error => {
        console.error(error);
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
