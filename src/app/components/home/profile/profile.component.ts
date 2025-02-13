import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { ProfileRequest } from 'src/app/models/request/profile-request';
import { ProfileResponse } from 'src/app/models/response/profile-response';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  iconSeleccionado: string = '';
  specialties!: any[];
  countries!: any[];
  updateForm!: FormGroup;
  nameUser: string = '';
  lastnameUser: string = '';
  username: string = '';
  titulosDisponibles: string[] = ['Dr.', 'Dra.', 'Lic.']; // Lista de títulos disponibles
  profileResponse!: ProfileResponse;

  constructor(private fb: FormBuilder, private profileService: ProfileService, private local: LocalAuthService
  , private userService: UserService, private http: HttpClient, private router: Router
    ) {
    this.updateForm = fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      domicile: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      whatsapp: ['', Validators.required],
      specialty: ['', Validators.required],
      mat_nac: ['', Validators.required],
      mat_prov: ['', Validators.required],
      presentation: ['', Validators.required],
      province: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getProfileComponent();
    this.getCurrentUser();
    initFlowbite();
    this.http.get<any[]>('./assets/data/specialty.json').subscribe(data => {
      this.specialties = data;
      console.log(this.specialties.length);
    });
    this.http.get<any[]>('./assets/data/countries.json').subscribe(data => {
      this.countries = data;
    })
    this.iconSeleccionado = "";
  }

  seleccionarIcono(icono: string): void {
    this.iconSeleccionado = icono;
    if(this.iconSeleccionado === 'profile'){
      this.router.navigate(['/home/profile']);
    }
    if(this.iconSeleccionado === 'center'){
      this.router.navigate(['/home/center']);
    }
    if(this.iconSeleccionado === 'calendar'){
      this.router.navigate(['/home/schedule']);
    }

  }

  public getProfileComponent() {
    const userId = this.local.getUserId();
    this.profileService.getProfile(userId!).subscribe(
      response => {
        console.log(response);
        this.profileResponse = response;
        this.updateForm.patchValue({
          title: response.title,
          name: response.name,
          lastname: response.lastname,
          domicile: response.domicile,
          phone: response.phone,
          city: response.city,
          country: response.country,
          whatsapp: response.whatsapp,
          specialty: response.specialty,
          mat_nac: response.mat_nac,
          mat_prov: response.mat_prov,
          presentation: response.presentation,
          province: response.province

        })
      },
      err => {
        console.log(err);
      }
    )
  }

  public updateProfileComponent() {
    console.log("Ingresando al metodo updateProfileComponent()")
    const profileId = this.local.getProfileId();
    const userId = this.local.getUserId();
    const request: ProfileRequest = this.updateForm.value;
    console.log("Imprimiendo ProfileRequest en metodo update" + profileId + userId + request.title)
    if (this.updateForm.valid && profileId != null && userId != null) {
      this.profileService.update(profileId, userId, request).subscribe(
        response => {
          console.log(response.message);
          // this.toastr.success(response.message + " " + response.status.toString());
        }, err => {
          console.log(err);
          if (err.status === 0) {
            // this.toastr.error("Acceso denegado");
          }
        }
      );
    }else{
      this.updateForm.markAllAsTouched();
    }

  }

  public getCurrentUser(){
    this.userService.getCurrentUser().subscribe({
      next: response => {
        console.log(response);
        this.nameUser = response.name;
        this.lastnameUser = response.username;
        this.username = response.username;
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        console.log("Completo getCurrentUser()");
      }


    })
  }



}
