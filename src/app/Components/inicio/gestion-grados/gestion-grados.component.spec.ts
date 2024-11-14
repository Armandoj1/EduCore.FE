import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGradosComponent } from './gestion-grados.component';

describe('GestionGradosComponent', () => {
  let component: GestionGradosComponent;
  let fixture: ComponentFixture<GestionGradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionGradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionGradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
