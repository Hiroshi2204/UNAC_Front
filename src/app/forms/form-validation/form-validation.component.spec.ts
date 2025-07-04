import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidationComponent } from './form-validation.component';

describe('FormValidationComponent', () => {
  let component: FormValidationComponent;
  let fixture: ComponentFixture<FormValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormValidationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
