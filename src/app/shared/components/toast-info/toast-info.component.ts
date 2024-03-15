import { Component, Input } from '@angular/core';
import { ToastService } from 'src/app/services/compartidos/toast.service';

@Component({
  selector: 'app-toast-info',
  templateUrl: './toast-info.component.html',
  styleUrl: './toast-info.component.css'
})
export class ToastInfoComponent {
  @Input() message!: string;
  isVisible: boolean = false;

  constructor(private toastService: ToastService) { }

  open() {
    this.isVisible = true;
  }

  close() {
    this.toastService.cerrarToastInfo();

  }
}
