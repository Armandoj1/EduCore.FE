import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionNotasComponent } from './gestion-notas.component';

describe('GestionNotasComponent', () => {
  let component: GestionNotasComponent;
  let fixture: ComponentFixture<GestionNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionNotasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
