import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { min } from 'rxjs';
import { Login } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';

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
      private toastr: ToastrService){
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

          },
          error: (err) => {
            console.log(err.error)
            if(err.status == 0){
              this.toastr.error('La solicitud CORS no resultó exitosa');
            }else{
              this.toastr.error(  'Email y/o password incorrectos');
            }

           // this.errores = err.error;
            // if(err.status == 400){
            //   // this.erroresDeValidacion = err.error;
            // }else if(err.status == 403){
            //   //this.erroresComunes= 'Email o Password incorrectos';
            //   this.toastr.error(  'Credenciales invalidas');
            // }
            setTimeout(() =>{
              this.loginForm.reset();
            }, 1000);
          },
          complete: () => {
            console.log("Login completo con exito");

          }

        });
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
