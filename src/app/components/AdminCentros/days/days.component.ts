import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { BusinessHoursResponse } from 'src/app/models/response/business-hours-response';
import { ToastService } from 'src/app/services/compartidos/toast.service';
import { DaysService } from 'src/app/services/days.service';
import { LocalAuthService } from 'src/app/services/local-auth.service';


@Component({
  selector: 'app-days',
  templateUrl: './days.component.html',
  styleUrl: './days.component.css'
})
export class DaysComponent implements OnInit {
  horasLunes: BusinessHoursResponse[] = [];
  horasMartes: BusinessHoursResponse[] = [];
  horasMiercoles: BusinessHoursResponse[] = [];
  horasJueves: BusinessHoursResponse[] = [];
  horasViernes: BusinessHoursResponse[] = [];
  horasSabados: BusinessHoursResponse[] = [];
  horasDomingo: BusinessHoursResponse[] = [];
  centerName = '';
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  mostrarToastSuccess: boolean = false;
  mensajeToast: string = '';
  mostrarToastDander: boolean = false;

  // daysOfWeek: string[] = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO'];
  constructor(private daysService: DaysService,
    private route: ActivatedRoute,
    private localAuthService: LocalAuthService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private dayService: DaysService,
    private toastService: ToastService,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const centerName = params['centerName'];
      this.centerName = centerName;

      await this.loadBusinessHours();

    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastSuccess = false;
    });
    this.toastService.cerrarToast$.subscribe(() => {
      this.mostrarToastDander = false;
    });
    setTimeout(() => {
      this.reinicializarFlowBite();
    }, 1000)
  }

  async loadBusinessHours(): Promise<void> {
    await Promise.all([
      this.getBusinessHours('Lunes'),
      this.getBusinessHours('Martes'),
      this.getBusinessHours('Miércoles'),
      this.getBusinessHours('Jueves'),
      this.getBusinessHours('Viernes'),
      this.getBusinessHours('Sábado'),
      this.getBusinessHours('Domingo'),

    ]);

  }

  getBusinessHours(day: string): Promise<void> {
    const userId = this.localAuthService.getUserId();
    if (userId != null) {
      return new Promise<void>((resolve) => {
        this.daysService.getAllBusinessHoursByCenterAndUserIdAndDay(this.centerName, userId, day).subscribe(
          (response) => {
            switch (day) {
              case 'Lunes':
                this.horasLunes = response;
                break;
              case 'Martes':
                this.horasMartes = response;
                break;
              case 'Miércoles':
                this.horasMiercoles = response;
                break;
              case 'Jueves':
                this.horasJueves = response;
                break;
              case 'Viernes':
                this.horasViernes = response;
                break;
              case 'Sábado':
                this.horasSabados = response;
                break;
              case 'Domingo':
                this.horasDomingo = response;
                break;
              default:
                break;
            }
            console.log("Horarios de atencion para el dia " + day, response);

            resolve(); // Resuelve la promesa después de actualizar los datos
          },
          (error) => {
            console.error(error);
            resolve(); // Resuelve la promesa incluso en caso de error
          }
        );
      });
    } else {
      // Agrega una lógica adicional si es necesario en caso de que userId sea null
      return Promise.resolve();
    }
  }

  getBusinessHoursForDay(day: string): BusinessHoursResponse[] {
    switch (day) {
      case 'Lunes':
        return this.horasLunes;
      case 'Martes':
        return this.horasMartes;
      case 'Miércoles':
        return this.horasMiercoles;
      case 'Jueves':
        return this.horasJueves;
      case 'Viernes':
        return this.horasViernes;
      case 'Sábado':
        return this.horasSabados;
      case 'Domingo':
        return this.horasDomingo;
      default:
        return [];
    }
  }

  deleteBusinessHourById(horaId: number) {
    const userId = this.localAuthService.getUserId();
    console.log("Entrando al metodo deleteBusinessHoursById()", horaId);
    this.dayService.deleteBusinessHourById(horaId, userId!).subscribe(
      response => {
        console.log(response);
       // Después de eliminar la hora, actualiza los datos
       this.loadBusinessHours().then(() => {
        // El retraso asegura que las horas se carguen antes de continuar
        // Esto asegura que las horasDomingo se actualicen correctamente
        // y la plantilla HTML se renderice correctamente
        console.log("horasDomingo después de eliminar:", this.horasDomingo);
        this.zone.run(() => {
          this.cdr.detectChanges();
          this.reinicializarFlowBite();
        });
      });
        this.mostrarToastSuccess = true;
        this.mensajeToast = response.message;

      },
      error => {
        console.error(error);
        this.mostrarToastSuccess = true;
        this.mensajeToast = error.error.message;
      }
    )
  }

  private reinicializarFlowBite() {
    this.zone.run(() => {
      setTimeout(() => {
        initFlowbite();
        this.cdr.detectChanges();
      });
    });
  }
}








