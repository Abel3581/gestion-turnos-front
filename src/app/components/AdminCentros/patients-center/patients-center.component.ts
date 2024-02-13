import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Page } from 'src/app/models/response/page';
import { PatientPageResponse } from 'src/app/models/response/patient-page-response';
import { PatientResponse } from 'src/app/models/response/patient-response';
import { LocalAuthService } from 'src/app/services/local-auth.service';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patients-center',
  templateUrl: './patients-center.component.html',
  styleUrl: './patients-center.component.css'
})
export class PatientsCenterComponent implements OnInit{
  centerName: string = '';
  name: string | null = '';
  surname: string | null = '';
  emailUser: string | null = '';
  patientsPage!: Page<PatientPageResponse>;
  page = 0;
  size = 4;

  constructor(private local: LocalAuthService,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private patientService: PatientService
              ){}

  ngOnInit(): void {
    this.name = this.local.getName();
    this.surname = this.local.getSurname();
    this.emailUser = this.local.getEmail();
    this.route.params.subscribe(params => {
      const centerName = params['centerName'];
      this.centerName = centerName;
      console.log("Centro de pacienteComponent: " + centerName);
    });

    this.getPatientsPage();


  }

  getPatientsPage(){
    const userId = this.local.getUserId();
    const center = this.centerName;
    console.log("GetPatientPage: " + userId + this.centerName);
    this.patientService.getPatientsPage(userId!, center, this.page, this.size).subscribe(
      response =>{
        this.patientsPage = response;
        console.log(response.content);
        console.log("Paginas: ", response);
        this.reinicializarFlowBite();
      },
      error =>{
        console.log(error);
      }
    )
  }

  onPageChange(page: number){
    this.page = page;
    this.getPatientsPage();
  }
  // Método para obtener el total de páginas
  getTotalPages(): number[] {
    if (this.patientsPage) {
      const totalPages = this.patientsPage.totalPages;
      return Array.from({ length: totalPages }, (_, index) => index);
    }
    return [];
  }

  getTotalPagesToShow(): number[] {
    const totalPages = this.patientsPage.totalPages;
    const currentPage = this.page;
    const visiblePages = 5; // Define cuántas páginas quieres mostrar alrededor de la actual

    let startPage: number;
    let endPage: number;

    if (totalPages <= visiblePages) {
      // Si el total de páginas es menor o igual a las páginas visibles, mostramos todas las páginas
      startPage = 0;
      endPage = totalPages - 1;
    } else {
      // Calculamos el rango de páginas para mostrar alrededor de la página actual
      const halfVisiblePages = Math.floor(visiblePages / 2);
      if (currentPage - halfVisiblePages <= 0) {
        // Si la página actual está cerca del inicio, mostramos desde la página 0
        startPage = 0;
        endPage = visiblePages - 1;
      } else if (currentPage + halfVisiblePages >= totalPages) {
        // Si la página actual está cerca del final, mostramos desde la página final
        startPage = totalPages - visiblePages;
        endPage = totalPages - 1;
      } else {
        // Mostramos el rango de páginas alrededor de la página actual
        startPage = currentPage - halfVisiblePages;
        endPage = currentPage + halfVisiblePages;
        // Ajustamos el rango si se sale de los límites
        if (endPage - startPage < visiblePages - 1) {
          endPage = startPage + visiblePages - 1;
        }
      }
    }

    // Aseguramos que las páginas a mostrar estén dentro de los límites
    startPage = Math.max(startPage, 0);
    endPage = Math.min(endPage, totalPages - 1);

    // Generamos un arreglo con las páginas a mostrar
    const pagesToShow = [];
    for (let i = startPage; i <= endPage; i++) {
      pagesToShow.push(i);
    }

    return pagesToShow;
  }


  private reinicializarFlowBite() {
    // Espera un momento antes de reinicializar para permitir que Angular actualice la vista
    setTimeout(() => {
      initFlowbite();
      this.cdr.detectChanges(); // Detecta cambios después de reinicializar FlowBite
    });
  }

}
