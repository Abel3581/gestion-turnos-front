import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

  private modalVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public modalVisible$: Observable<boolean> = this.modalVisibleSubject.asObservable();
  // Propiedades para almacenar datos
  private fechaSubject: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  public fecha$: Observable<Date | null> = this.fechaSubject.asObservable();


  private horaSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public hora$: Observable<string> = this.horaSubject.asObservable();

  private centroSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public centro$: Observable<string> = this.centroSubject.asObservable();
  // Almacena las suscripciones para desuscribirse más tarde
  private modalVisibleSubscription: Subscription | undefined;
  private fechaSubscription: Subscription | undefined;
  private horaSubscription: Subscription | undefined;
  private centroSubscription: Subscription | undefined;

  constructor() { }

  public showModal(fecha: Date, hora: string, centro: string): void {
    // Guarda los datos en las propiedades del servicio
    const dateFormat = this.dateFormat(fecha);
    console.log("ModalService " + "fecha: " + dateFormat + " hora: " + hora + "centro: " + centro);

    this.fechaSubject.next(fecha);
    this.horaSubject.next(hora);
    this.centroSubject.next(centro);

    // Muestra el modal
    this.modalVisibleSubject.next(true);
  }
  public hideModal(): void {
    this.modalVisibleSubject.next(false);
  }

  // Método para desuscribirse de todas las suscripciones
  public unsubscribeAll(): void {
    this.modalVisibleSubscription?.unsubscribe();
    this.fechaSubscription?.unsubscribe();
    this.horaSubscription?.unsubscribe();
    this.centroSubscription?.unsubscribe();
  }
   // Función para formatear la fecha en "YYYY-MM-DD"
   private dateFormat(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses son de 0 a 11
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }




}
