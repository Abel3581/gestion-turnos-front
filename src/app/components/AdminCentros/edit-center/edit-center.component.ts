import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DaysComponent } from '../days/days.component';
import { ActivatedRoute } from '@angular/router';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientsCenterComponent } from '../patients-center/patients-center.component';

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

  constructor(private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private local: LocalAuthService
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



}
