import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';

@Component({
  selector: 'app-health-center',
  templateUrl: './health-center.component.html',
  styleUrls: ['./health-center.component.css']
})
export class HealthCenterComponent {

  formGroup!: FormGroup;
  liSeleccionado: string = "";
  display: boolean = false;
  visible: boolean = false;

  constructor(private fb: FormBuilder, private centerService: HealthCenterService,
    private local: LocalAuthService, private tostr: ToastrService){
    this.formGroup = fb.group({
      name : ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required]

  })

  }
  public showDialog() {
    this.visible = true;
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
          console.log(response.status.toString() + response.message);
          this.tostr.success(response.status.toString() + response.message);
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

}
