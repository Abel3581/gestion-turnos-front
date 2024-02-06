import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DaysComponent } from '../days/days.component';
import { ActivatedRoute } from '@angular/router';
import { LocalAuthService } from 'src/app/services/local-auth.service';

@Component({
  selector: 'app-edit-center',
  templateUrl: './edit-center.component.html',
  styleUrl: './edit-center.component.css'
})
export class EditCenterComponent implements OnInit{
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef | undefined;
  centerName: string = '';
  name: string = '';
  surname: string = '';
  constructor(private cdr: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private localService: LocalAuthService
    ){

    }

    ngOnInit(): void {
   //this.loadComponent('ComponenteDias');
     // Suscríbete a los cambios en los parámetros del enrutador
     this.route.params.subscribe(params => {
      // Extrae el valor del parámetro centerName
      const centerName = params['centerName'];
      // Ahora, puedes usar centerName como desees, por ejemplo, cargar el componente correspondiente
      //this.loadComponent(centerName);
      // Asigna el valor a la propiedad de la clase si lo necesitas para otras partes del componente
      this.centerName = centerName;

    });

  }

  ngAfterViewInit(): void {
   this.loadComponent('ComponenteDias');
   this.name = this.localService.getName()!;
   this.surname = this.localService.getSurname()!;
  }

  // private reinicializarFlowBite() {
  //   // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
  //   setTimeout(() => {
  //     initFlowbite();
  //     this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
  //   });
  // }

  loadComponent(componentName: string) {

    // Obtiene la clase del componente según el nombre
    const componentType: Type<any> = this.getComponentTypeByName(componentName);

    // Resuelve la factoría del componente
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    // Limpia el contenedor dinámico antes de cargar un nuevo componente
    this.dynamicComponentContainer?.clear();

    // Crea una instancia del componente y lo inserta en el contenedor dinámico
    const componentRef = this.dynamicComponentContainer?.createComponent(componentFactory);

  }

  private getComponentTypeByName(componentName: string): Type<any> {
    // Mapea el nombre del componente a su tipo. Ajusta según la estructura de tu aplicación.

    switch (componentName) {
      case 'ComponenteDias':
        return DaysComponent;
      // Añade otros casos según sea necesario para otros componentes
      default:
        throw new Error(`Componente desconocido: ${componentName}`);
    }
  }

}
