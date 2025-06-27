import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaResolucionComponent } from './vista-resolucion.component';

describe('VistaResolucionComponent', () => {
  let component: VistaResolucionComponent;
  let fixture: ComponentFixture<VistaResolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaResolucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaResolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
