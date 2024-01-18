import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-turns',
  templateUrl: './modal-turns.component.html',
  styleUrl: './modal-turns.component.css'
})
export class ModalTurnsComponent {

  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  public showDialog() {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  public closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
