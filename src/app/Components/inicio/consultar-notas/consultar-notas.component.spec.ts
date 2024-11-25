import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarNotasComponent } from './consultar-notas.component';

describe('ConsultarNotasComponent', () => {
  let component: ConsultarNotasComponent;
  let fixture: ComponentFixture<ConsultarNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultarNotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
