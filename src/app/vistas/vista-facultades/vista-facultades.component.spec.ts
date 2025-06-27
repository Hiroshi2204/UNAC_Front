import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaFacultadesComponent } from './vista-facultades.component';

describe('VistaFacultadesComponent', () => {
  let component: VistaFacultadesComponent;
  let fixture: ComponentFixture<VistaFacultadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaFacultadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaFacultadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
