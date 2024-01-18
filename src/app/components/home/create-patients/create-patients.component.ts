import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ToastrService } from 'ngx-toastr';
import { PatientRequest } from 'src/app/models/request/patient-request';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-create-patients',
  templateUrl: './create-patients.component.html',
  styleUrl: './create-patients.component.css'
})
export class CreatePatientsComponent implements OnInit {

  formAltaPatient!: FormGroup;
  iconSeleccionado: string = '';

  constructor(private router: Router, private cdr: ChangeDetectorRef, private fb: FormBuilder,
    private patientService: PatientService, private tostr: ToastrService, private local: LocalAuthService) {
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
      landline: ['']

    })
  }

  get dniControl() {
    return this.formAltaPatient.get('dni');
  }
  get emailControl(){
    return this .formAltaPatient.get('email');
  }

  ngOnInit(): void {
    this.iconSeleccionado = '';
    initFlowbite();

  }

  seleccionarIcono(icono: string): void {
    this.iconSeleccionado = icono;
    console.log('Icono seleccionado:', icono);
    if (this.iconSeleccionado === 'profile') {
      console.log('Navegando a /home/user-profile');
      this.router.navigate(['/home/user-profile']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'center') {
      console.log('Navegando a /home/center');
      this.router.navigate(['/home/center']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'calendar') {
      console.log('Navegando a /home/schedule');
      this.router.navigate(['/home/schedule']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'user') {
      console.log('Navegando a /home/create-patients');
      this.router.navigate(['/home/create-patients']);
      this.reinicializarFlowBite();
    }
    if (this.iconSeleccionado === 'volver') {
      console.log('Navegando a /home/view-schedule');
      this.router.navigate(['/home/view-schedule']);
      this.reinicializarFlowBite();
    }

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
      if(this.formAltaPatient.valid && userId != null){
        console.log("Formulario validado")
        this.patientService.createPatient(userId!, request).subscribe(
          response => {
            console.log("Paciente creado")
            console.log(response);
            this.tostr.success(response.message);
          },
          err => {
             this.tostr.error(err.error.error);
             console.log(err);

          }

        )
      }else {
        this.formAltaPatient.markAllAsTouched();

      }
    }

}
