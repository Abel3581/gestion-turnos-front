import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitionSesionComponent } from './inition-sesion.component';

describe('InitionSesionComponent', () => {
  let component: InitionSesionComponent;
  let fixture: ComponentFixture<InitionSesionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitionSesionComponent]
    });
    fixture = TestBed.createComponent(InitionSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
