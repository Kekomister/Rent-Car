import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsperaComponent } from './espera.component';

describe('EsperaComponent', () => {
  let component: EsperaComponent;
  let fixture: ComponentFixture<EsperaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EsperaComponent]
    });
    fixture = TestBed.createComponent(EsperaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
