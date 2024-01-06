import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HealthCenterResponse } from 'src/app/models/response/health-center-response';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-health-center',
  templateUrl: './health-center.component.html',
  styleUrls: ['./health-center.component.css']
})
export class HealthCenterComponent implements OnInit{

  formGroup!: FormGroup;
  liSeleccionado: string = "";
  display: boolean = false;
  visible: boolean = false;
  centers!: HealthCenterResponse[];

  constructor(private fb: FormBuilder, private centerService: HealthCenterService,
    private local: LocalAuthService, private tostr: ToastrService, private userService: UserService,
    private zone: NgZone){
    this.formGroup = fb.group({
      name : ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required]

  })

  }

  ngOnInit(): void {
    this.getAllCenters();

  }

  public showDialog() {
    this.visible = true;
  }

  public modalClose(){
    this.visible = false;
  }

  public seleccionarLi(li: string): void{
    this.liSeleccionado = li;
  }

  public createCenter(){
    if(this.formGroup.valid){
      const userId = this.local.getUserId();
      const request = this.formGroup.value;
      console.log("UserId: en createCenter():" + userId);
      this.centerService.createCenter(userId!, request).subscribe(
        response =>{
          console.log(response.message);
          this.tostr.success(response.message);
          this.formGroup.reset();
           // Después de crear el centro, actualiza la lista de centros
           this.zone.run(() => {
            this.getAllCenters();
          });
        },
        err => {
          console.log(err.error);
          this.tostr.error(err.error);
        }
      )

    }else{
      this.formGroup.markAllAsTouched();
    }
  }

  public getAllCenters(){

    const userId = this.local.getUserId();
    if(userId != null){
      this.userService.getAllCenterForUser(userId).subscribe(
        response => {
          console.log(response);
          this.centers = response;
        },
        err => {
          console.log(err.error);

        }
      )
    }
  }
}
