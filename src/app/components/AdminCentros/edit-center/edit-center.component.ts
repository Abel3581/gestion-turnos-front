import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DaysComponent } from '../days/days.component';
import { ActivatedRoute } from '@angular/router';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientsCenterComponent } from '../patients-center/patients-center.component';
import { ImageResponse } from 'src/app/models/response/image-response';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-edit-center',
  templateUrl: './edit-center.component.html',
  styleUrl: './edit-center.component.css'
})
export class EditCenterComponent implements OnInit {
  centerName: string = '';
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;

  constructor(private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private local: LocalAuthService,
              private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    // Suscríbete a los cambios en los parámetros del enrutador
    this.route.params.subscribe(params => {
      // Extrae el valor del parámetro centerName
      const centerName = params['centerName'];
      // Ahora, puedes usar centerName como desees, por ejemplo, cargar el componente correspondiente
      //this.loadComponent(centerName);
      // Asigna el valor a la propiedad de la clase si lo necesitas para otras partes del componente
      this.centerName = centerName;

      console.log("Nombre centro " + this.centerName);
      // Cargar el componente de días por defecto al inicio

    });
    this.getImage();
    this.reinicializarFlowBite();


  }

  ngAfterViewInit(): void {



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



}
