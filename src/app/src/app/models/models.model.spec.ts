import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsModel } from './models.model';

describe('ModelsModel', () => {
  let component: ModelsModel;
  let fixture: ComponentFixture<ModelsModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelsModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelsModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
