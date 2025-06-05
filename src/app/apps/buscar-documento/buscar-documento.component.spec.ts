import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarDocumentoComponent } from './buscar-documento.component';

describe('BuscarDocumentoComponent', () => {
  let component: BuscarDocumentoComponent;
  let fixture: ComponentFixture<BuscarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
