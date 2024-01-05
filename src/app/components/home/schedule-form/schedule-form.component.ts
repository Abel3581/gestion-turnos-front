import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css'
})
export class ScheduleFormComponent {

  timeForm: FormGroup;

  constructor() {
    this.timeForm = new FormGroup({
      startTime: new FormControl('08:00'),
      endTime: new FormControl('18:00'),
    });
  }

  incrementHours(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes + 60) % (24 * 60); // Incrementa en 60 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  decrementHours(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes - 60 + 24 * 60) % (24 * 60); // Decrementa en 60 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  incrementMinutes(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes + 5) % (24 * 60); // Incrementa en 5 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }

  decrementMinutes(fieldName: string) {
    const currentControlValue = this.timeForm.get(fieldName)?.value;
    const currentTime = currentControlValue.split(':').map(Number);

    const totalMinutes = currentTime[0] * 60 + currentTime[1];
    const newTotalMinutes = (totalMinutes - 5 + 24 * 60) % (24 * 60); // Decrementa en 5 minutos y ajusta al formato de 24 horas

    this.timeForm.get(fieldName)?.setValue(this.formatTime(newTotalMinutes));
  }


  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(remainder).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }
}
