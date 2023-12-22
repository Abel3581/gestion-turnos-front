import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegisterRequest } from 'src/app/models/request/register-request';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {

  registerForm: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private toastr: ToastrService ){
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

  register(){
    if(this.registerForm.valid){
      const request: RegisterRequest = this.registerForm.value;
      this.authService.register(request).subscribe(
        data => {
          console.log(data);
          this.toastr.success(data.message);
          this.registerForm.reset();
        }, error => {
          console.log(error);
          this.toastr.error(error.error);

        }
      )
    }else{
      this.registerForm.markAllAsTouched();
    }

  }
}
