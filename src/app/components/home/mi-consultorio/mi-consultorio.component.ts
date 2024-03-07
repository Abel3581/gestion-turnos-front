import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ImageResponse } from 'src/app/models/response/image-response';
import { TurnResponse } from 'src/app/models/response/turn-response';
import { HealthCenterService } from 'src/app/services/health-center.service';
import { ImageService } from 'src/app/services/image.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';
import { TurnService } from 'src/app/services/turn.service';

@Component({
  selector: 'app-mi-consultorio',
  templateUrl: './mi-consultorio.component.html',
  styleUrl: './mi-consultorio.component.css'
})
export class MiConsultorioComponent implements OnInit {

  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  totalPatiens: number = 0;
  totalAgendas: number = 0;
  turns: TurnResponse[] = [];
  selectedOption: string = 'Pendiente'; // Valor por defecto
  options: string[] = ['En_curso', 'Finalizado', 'No_llegó'];
  image!: ImageResponse;
  imageUrl: string | undefined;
  selectedFile: File | null = null;

  constructor(private patientService: PatientService,
    private centerService: HealthCenterService,
    private local: LocalAuthService,
    private cdr: ChangeDetectorRef,
    private turnService: TurnService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    const userId = this.local.getUserId();
    const name = this.local.getName();
    const surname = this.local.getSurname();
    this.name = name;
    this.surname = surname;
    this.emailUser = this.local.getEmail();
    // this.http.get<string[]>('./assets/data/hours.json').subscribe((data) => {
    //   this.hours = data;

    // });
    this.patientService.getTotalPatientsByUserId(userId!).subscribe(
      total => {
        this.totalPatiens = total;
      }
    );
    this.centerService.totalCentersByUser(userId!).subscribe(
      total => {
        this.totalAgendas = total;
      }
    );
    this.getAllTurnsByUserId();
    this.getImage();
    // this.cambiarEstado(11, 'ATENDIDO');
    this.reinicializarFlowBite();
  }

  getAllTurnsByUserId() {
    const userId = this.local.getUserId();
    this.turnService.getAllTurnsByUserId(userId!).subscribe(
      response => {
        console.log(response);
        this.turns = response;
        this.reinicializarFlowBite();
      },
      error => {
        console.log(error);
      }
    )
  }

  updateSelectedOption(option: string) {
    this.selectedOption = option;
  }

  cambiarEstado(turnId: number, estado: string) {
    console.log("Tuno id: " + turnId + " Estado: " + estado);
    this.turnService.changeStatus(turnId, estado).subscribe(
      response => {
        console.log(response);
        this.getAllTurnsByUserId();
      },
      error => {
        console.log(error);
      }
    )
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
