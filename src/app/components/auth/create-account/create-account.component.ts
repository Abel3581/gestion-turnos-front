import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {

  registerForm!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder ){
    this.registerForm = formBuilder.group({
      title: ['TI'],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      specialty: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      country: [''],

    })
  }

  register(){

  }
}
