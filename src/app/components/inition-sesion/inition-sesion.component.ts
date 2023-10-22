import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inition-sesion',
  templateUrl: './inition-sesion.component.html',
  styleUrls: ['./inition-sesion.component.css']
})
export class InitionSesionComponent {

    loginForm: FormGroup;
    erroresDeValidacion : any;
    erroresComunes: any;

    errores: string[] | undefined;

    constructor(private fb: FormBuilder, private authService: AuthService){
      this.loginForm = this.fb.group({
        username: ["", Validators.required],
        password: ["", Validators.required]
      });

    }

    onSubmit(){
      if (this.loginForm.valid) {
        const request: Login = this.loginForm.value;
        this.authService.login(request).subscribe({
          next: (response)=>{
            console.log(response);
            this.erroresComunes = '';
            this.erroresDeValidacion = '';

          },
          error: (err) => {
            console.log(err.error)
            this.errores = err.error;
            if(err.status == 400){
              this.erroresDeValidacion = err.error;
            }else{
              this.erroresComunes=err.error.message;
            }
          },
          complete: () => {
            console.log("Login completo con exito");

          }

        });
      }
    }

  }
