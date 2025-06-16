import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOficioComponent } from './editar-oficio.component';

describe('EditarOficioComponent', () => {
  let component: EditarOficioComponent;
  let fixture: ComponentFixture<EditarOficioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarOficioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
