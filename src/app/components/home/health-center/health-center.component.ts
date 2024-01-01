import { Component } from '@angular/core';

@Component({
  selector: 'app-health-center',
  templateUrl: './health-center.component.html',
  styleUrls: ['./health-center.component.css']
})
export class HealthCenterComponent {

  liSeleccionado: string = "";

  public seleccionarLi(li: string): void{
    this.liSeleccionado = li;
  }

}
