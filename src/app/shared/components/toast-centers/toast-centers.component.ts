import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/compartidos/toast.service';

@Component({
  selector: 'app-toast-centers',
  templateUrl: './toast-centers.component.html',
  styleUrl: './toast-centers.component.css'
})
export class ToastCentersComponent {

  isVisible: boolean = false;

  constructor(private toastService: ToastService,
              private router: Router) { }

  close() {
    this.toastService.cerrarToastCenters();

  }
  navigateA() {
    this.router.navigateByUrl("/home/schedule");
  }
}
