import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BienvenidaComponent } from './bienvenida.component';

describe('BienvenidaComponent', () => {
  let component: BienvenidaComponent;
  let fixture: ComponentFixture<BienvenidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienvenidaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienvenidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 metric cards', () => {
    expect(component.metricCards.length).toBe(4);
  });

  it('should have 4 recent activities', () => {
    expect(component.recentActivity.length).toBe(4);
  });
});