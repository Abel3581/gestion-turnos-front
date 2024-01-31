import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PrimeNGConfig } from 'primeng/api';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'gestion-front';
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    initFlowbite();
    this.primengConfig.ripple = true;
  }

}
