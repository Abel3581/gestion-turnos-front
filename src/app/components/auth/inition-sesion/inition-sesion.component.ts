import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { min, timeout } from 'rxjs';
import { Login } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';

@Component({
  selector: 'app-inition-sesion',
  templateUrl: './inition-sesion.component.html',
  styleUrls: ['./inition-sesion.component.css']
})
export class InitionSesionComponent {

    loginForm: FormGroup;
    //erroresDeValidacion : any;
    errores: string[] | undefined;

    constructor(private fb: FormBuilder, private authService: AuthService,
      private toastr: ToastrService, private localAuth: LocalAuthService, private router: Router){
      this.loginForm = this.fb.group({
        username: ["",[Validators.required,Validators.email] ],
        password: ["", [Validators.required,Validators.minLength(8)]]
      });

    }

    get email(){
      return this.loginForm.controls['username'];
    }

    get password()
    {
      return this.loginForm.controls['password'];
    }

    onSubmit(){
      if (this.loginForm.valid) {
        const request: Login = this.loginForm.value;
        this.authService.login(request).subscribe({
          next: (response)=>{
            console.log(response);
            // this.erroresDeValidacion = '';
            if(response.token != ""){
              this.localAuth.setToken(response.token);
              this.localAuth.setUserId(response.id);
              this.localAuth.setProfileId(response.profileId);
            }
            this.toastr.success(response.message);
            setTimeout(() => {
              this.router.navigate(['home/profile']);
            }, 3000);
          },
          error: (err) => {
            console.log(err.message)
              this.toastr.error(err.error.message);
            setTimeout(() =>{
              this.loginForm.reset();
            }, 1000);
          },
          complete: () => {
            console.log("Login completo con exito");
          }
        });
      }else{
        this.loginForm.markAllAsTouched();
      }
    }

    // onUsernameInput() {
    //   // Borra los errores cuando se comienza a escribir en el campo de usuario.
    //   // this.erroresDeValidacion = '';

    // }

    onUsernameInput() {
      // Obtén el valor del campo de entrada y verifica si está vacío
      const usernameInput = this.loginForm.get('username');
      if (usernameInput!.value.trim() !== '') {
          usernameInput!.setValue(usernameInput!.value.trim()); // Elimina espacios iniciales/finales
      }
  }


  }
