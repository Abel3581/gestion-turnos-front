import { Component, Input } from '@angular/core';
import { ToastService } from 'src/app/services/compartidos/toast.service';

@Component({
  selector: 'app-toast-danger',
  templateUrl: './toast-danger.component.html',
  styleUrl: './toast-danger.component.css'
})
export class ToastDangerComponent {
  @Input() mensaje!: string; // Propiedad de entrada para recibir el mensaje del toast
  isVisible: boolean = false;

  constructor(private toastService: ToastService){}

  open() {
      this.isVisible = true;
  }

  close() {
      this.toastService.cerrarToastDanger();

  }
}
