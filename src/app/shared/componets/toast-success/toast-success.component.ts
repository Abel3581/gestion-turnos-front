import { Component, Input } from '@angular/core';
import { ToastService } from 'src/app/services/compartidos/toast.service';

@Component({
  selector: 'app-toast-success',
  templateUrl: './toast-success.component.html',
  styleUrl: './toast-success.component.css'
})
export class ToastSuccessComponent {
  @Input() mensaje!: string; // Propiedad de entrada para recibir el mensaje del toast
  isVisible: boolean = false;

  constructor(private toastService: ToastService){}

  open() {
      this.isVisible = true;
  }

  close() {
      this.toastService.cerrarToast();

  }
}
