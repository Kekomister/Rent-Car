import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcSucursalesComponent } from './cc-sucursales.component';

describe('CcSucursalesComponent', () => {
  let component: CcSucursalesComponent;
  let fixture: ComponentFixture<CcSucursalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CcSucursalesComponent]
    });
    fixture = TestBed.createComponent(CcSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
