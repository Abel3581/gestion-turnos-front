import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HealthCenterResponse } from 'src/app/models/response/health-center-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { TotalCentrosService } from 'src/app/services/compartidos/total-centros.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
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

  constructor(private fb: FormBuilder,
    private centerService: HealthCenterService,
    private local: LocalAuthService,
    private userService: UserService,
    private zone: NgZone,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private totalCentersService: TotalCentrosService,
    private patientService: PatientService,
    private toastService: ToastService) {
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


}
