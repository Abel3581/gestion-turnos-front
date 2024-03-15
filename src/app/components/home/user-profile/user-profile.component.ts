import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { ProfileRequest } from 'src/app/models/request/profile-request';
import { ImageResponse } from 'src/app/models/response/image-response';
import { ProfileResponse } from 'src/app/models/response/profile-response';
import { TotalCentrosService } from 'src/app/services/compartidos/total-centros.service';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  iconSeleccionado: string = '';
  specialties!: any[];
  countries!: any[];
  updateForm!: FormGroup;
  nameUser: string = '';
  lastnameUser: string = '';
  username: string = '';
  titulosDisponibles: string[] = ['Dr.', 'Dra.', 'Lic.']; // Lista de títulos disponibles
  profileResponse!: ProfileResponse;
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalCentros: number = 0;
  totalAgendas: number = 0;
  totalPatients: number = 0;
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder,
    private profileService: ProfileService,
    private local: LocalAuthService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private totalCentrosService: TotalCentrosService,
    private patientService: PatientService,
    private centerService: HealthCenterService,
    private imageService: ImageService
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
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.getProfileComponent();
    this.getCurrentUser();

    this.http.get<any[]>('./assets/data/specialty.json').subscribe(data => {
      this.specialties = data;
      console.log(this.specialties.length);
    });
    this.http.get<any[]>('./assets/data/countries.json').subscribe(data => {
      this.countries = data;
    })
    // initFlowbite();
    this.iconSeleccionado = "";
    this.totalCentrosService.totalCentros$.subscribe(
      total => {
        this.totalCentros = total;
      }
    )
    this.patientService.getTotalPatientsByUserId(this.local.getUserId()!).subscribe(
      total => {
        this.totalPatients = total;
      }
    )
    this.centerService.totalCentersByUser(this.local.getUserId()!).subscribe(
      total => {
        this.totalAgendas = total;
      }
    )
    this.getImage();
    this.reinicializarFlowBite();
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
    } else {
      this.updateForm.markAllAsTouched();
    }

  }

  public getCurrentUser() {
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    const userId = this.local.getUserId();
    if (this.selectedFile) {
      this.imageService.uploadImage(userId!, this.selectedFile).subscribe(
        response => {
          console.log(response);
          this.getImage();
          this.selectedFile = null;
        },
        error => {
          console.error(error);
          // Aquí puedes manejar el error
        }
      );

    }

  }

  getImage(): void {
    console.log("Entrando al metodo getImage()");
    const userId = this.local.getUserId();
    console.log("UserId del getImage(): " + userId);
    this.imageService.getImageByUserId(userId!).subscribe(
      response => {
        this.image = response; // Asigna los datos de la imagen
        console.log("Respuesta getImage(): ", response);

        // Aquí asumimos que tienes acceso a los datos de la imagen
        const imageDataBase64 = response.imageData;

        // Decodificar los datos base64 en un ArrayBuffer
        const arrayBuffer = this.base64ToArrayBuffer(imageDataBase64);

        // Crear un blob a partir del ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: response.imageType });

        // Crear una URL de objeto para el blob
        this.imageUrl = URL.createObjectURL(blob);


      },
      error => {
        console.error('Failed to get image:', error);
      }
    );
  }

  // Función para convertir una cadena base64 en un ArrayBuffer
  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

}
