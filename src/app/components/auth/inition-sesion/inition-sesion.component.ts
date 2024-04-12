import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { Login } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';

@Component({
  selector: 'app-inition-sesion',
  templateUrl: './inition-sesion.component.html',
  styleUrls: ['./inition-sesion.component.css']
})
export class InitionSesionComponent implements OnInit {
  mostrarToast: boolean = false;
  mensajeToast: string = ''; // Variable para almacenar el mensaje del toast
  mostrarToastDander: boolean = false;
  loginForm: FormGroup;
  //erroresDeValidacion : any;
  errores: string[] | undefined;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private localAuth: LocalAuthService,
    private router: Router,
    private toastService: ToastService) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });

  }

  ngOnInit(): void {
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToast = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    initFlowbite();
  }

  get email() {
    return this.loginForm.controls['username'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const request: Login = this.loginForm.value;
      this.authService.login(request).subscribe({
        next: (response) => {
          console.log(response);
          this.localAuth.setToken(response.token);
          this.localAuth.setUserId(response.id);
          this.localAuth.setProfileId(response.profileId);
          this.localAuth.setName(response.name);
          this.localAuth.setSurname(response.lastname);
          this.localAuth.setEmail(response.userName);
          this.localAuth.setRole(response.role);

          this.mostrarToast = true;
          this.mensajeToast = response.message;

          setTimeout(() => {
            this.router.navigateByUrl('home/view-schedule');
          }, 3000);
        },
        error: (err) => {
          if (err.error) {
            console.log(err.error); // Manejar el objeto de error devuelto por el servidor
            this.mostrarToastDander = true;
            this.mensajeToast = err.error.message;
            setTimeout(() => {
              this.loginForm.reset();
            }, 1000);
          } else {
            console.log('Error desconocido:', err); // Manejar otros errores desconocidos
          }

        },
        complete: () => {
          console.log("Login completo con exito");
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onUsernameInput() {
    // Obtén el valor del campo de entrada y verifica si está vacío
    const usernameInput = this.loginForm.get('username');
    if (usernameInput!.value.trim() !== '') {
      usernameInput!.setValue(usernameInput!.value.trim()); // Elimina espacios iniciales/finales
    }
  }


}
