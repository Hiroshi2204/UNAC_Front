import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPublicoComponent } from './footer-publico.component';

describe('FooterPublicoComponent', () => {
  let component: FooterPublicoComponent;
  let fixture: ComponentFixture<FooterPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterPublicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
