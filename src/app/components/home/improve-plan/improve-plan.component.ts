import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PaymentAppRequest } from 'src/app/models/request/paymentApp-request';
import { ImageResponse } from 'src/app/models/response/image-response';
import { MessageResponse } from 'src/app/models/response/message-response';
import { PaymentResponse } from 'src/app/models/response/payment-response';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-improve-plan',
  templateUrl: './improve-plan.component.html',
  styleUrl: './improve-plan.component.css'
})
export class ImprovePlanComponent implements OnInit {
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  image!: ImageResponse;
  imageUrl: string | undefined;
  messageResponse!: MessageResponse;
  paymentRequest!: PaymentAppRequest;
  paymentResponse!: PaymentResponse;
  precioBase: number = 5000;
  descuentoPorcentaje: number = 0;
  diaDelMes = new Date().getDate();
  totalConDescuento: number = 0;
  descuentoString: string = "";

  constructor(private local: LocalAuthService,
    private imageService: ImageService,
    private userService: UserService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.paymentRequest = {
      userId: null!, // o cualquier valor por defecto que desees
      total: 0 // o cualquier valor por defecto que desees
    };
  }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.getImage();
    this.verifyStatusUser();
    this.calcularTotal();
    setTimeout(() => {
      this.reinicializarFlowBite();
    }, 500)
  }

  initializeModal(): void {
    const modalButton = this.elementRef.nativeElement.querySelector('[data-modal-toggle="popup-modal"]');
    const modal = this.elementRef.nativeElement.querySelector('#popup-modal');

    modalButton.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

  getImage(): void {
    console.log("Entrando al metodo getImage()")
    const userId = this.local.getUserId();
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

  public verifyStatusUser() {
    const userId = this.local.getUserId();
    if (userId != null) {
      this.userService.verifyStatusUser(userId).subscribe(
        response => {
          console.log(response);
          this.messageResponse = response;
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  public createPayment() {
    this.paymentRequest.userId = this.local.getUserId()!;
    this.paymentRequest.total = this.totalConDescuento;
    this.paymentService.createPayment(this.paymentRequest).subscribe(
      response => {
        console.log(response);
        this.paymentResponse = response;
        this.openInIncognitoWindow(response.preferenceIdPaymentMPago);

      },
      error => {
        console.log(error);
      }
    )
  }

  public openInIncognitoWindow(url: string): void {
    // Abre la URL en una nueva ventana incógnita (si es posible)
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    // Verifica si la ventana se abrió correctamente
    if (newWindow) {
      // Si se abrió correctamente, enfoca la ventana
      newWindow.focus();
    } else {
      // Si no se pudo abrir la ventana, muestra un mensaje de error o maneja la situación de otra manera
      console.error('No se pudo abrir la ventana incógnita.');
    }
  }

  calcularTotal() {
    const diaDelMes = new Date().getDate(); // Obtener el día del mes

    // Función para calcular el porcentaje de descuento basado en el día del mes
    const calcularPorcentajeDescuento = (dia: number): number => {
      if (dia >= 2 && dia <= 30) {
        // Define tus propias reglas para el porcentaje de descuento según el día
        if (dia <= 3) {
          this.descuentoString = "20%";
          return 0.2; // Descuento del 20% para los días 1, 2 y 3
        } else if (dia <= 7) {
          this.descuentoString = "25%";
          return 0.25; // Descuento del 25% para los días 4 al 7
        } else if (dia === 10) {
          this.descuentoString = "40%";
          return 0.4; // Descuento del 40% para el día 10
        } else if (dia === 15) {
          this.descuentoString = "50%";
          return 0.5; // Descuento del 50% para el día 15
        } else if (dia <= 19) {
          this.descuentoString = "55%";
          return 0.55; // Descuento del 55% para los días 16 al 19
        } else if (dia <= 22) {
          this.descuentoString = "60%";
          return 0.6; // Descuento del 60% para los días 20 al 22
        } else if (dia <= 24) {
          this.descuentoString = "65%";
          return 0.65; // Descuento del 65% para los días 23 y 24
        } else if (dia === 25) {
          this.descuentoString = "70%";
          return 0.7; // Descuento del 70% para el día 25
        } else if (dia <= 27) {
          this.descuentoString = "75%";
          return 0.75; // Descuento del 75% para los días 26 y 27
        } else {
          this.descuentoString = "80%";
          return 0.8; // Descuento del 80% para los días 28 al 30
        }
      } else {
        return 0; // No hay descuento para otros días del mes
      }
    }

    // Obtener el porcentaje de descuento para el día del mes actual
    const descuentoPorcentaje = calcularPorcentajeDescuento(diaDelMes);

    // Calcular el descuento
    const descuento = this.precioBase * descuentoPorcentaje;

    // Calcular el total restando el descuento al precio base
    const total = this.precioBase - descuento;

    // Asignar el total con descuento a la propiedad correspondiente
    this.totalConDescuento = total;

    // Devolver el total calculado
    return total;

  }





}
