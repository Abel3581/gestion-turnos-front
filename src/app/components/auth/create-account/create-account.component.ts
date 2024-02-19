import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { RegisterRequest } from 'src/app/models/request/register-request';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/compartidos/toast.service';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  specialties!: any[];
  countries!: any[];
  registerForm: FormGroup;
  mostrarToastSuccess: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private http: HttpClient,
              private toastService: ToastService ){
    this.registerForm = formBuilder.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      specialty: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      country: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    initFlowbite();
    this.http.get<any[]>('./assets/data/specialty.json').subscribe(data => {
      this.specialties = data;
      console.log(this.specialties.length);
    });
    this.http.get<any[]>('./assets/data/countries.json').subscribe(data => {
      this.countries = data;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
  }

  register(){
    if(this.registerForm.valid){
      const request: RegisterRequest = this.registerForm.value;
      this.authService.register(request).subscribe(
        data => {
          console.log(data);
          // this.toastr.success(data.message);
          this.mostrarToastSuccess = true;
          this.mensajeToast = data.message;
          this.registerForm.reset();
          alert("Serás redireccionado al login del usuario para iniciar sesión. 🚀✨");
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
        }, error => {
          console.log(error);
          // this.toastr.error(error.error);
          this.mostrarToastDander = true;
          this.mensajeToast = error.error;
        }
      )
    }else{
      this.registerForm.markAllAsTouched();
    }

  }

  show():void{

  }
}
