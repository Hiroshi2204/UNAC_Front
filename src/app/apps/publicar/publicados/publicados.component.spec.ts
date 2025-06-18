import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicadosComponent } from './publicados.component';

describe('PublicadosComponent', () => {
  let component: PublicadosComponent;
  let fixture: ComponentFixture<PublicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
