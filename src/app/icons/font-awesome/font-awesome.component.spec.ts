import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeComponent } from './font-awesome.component';

describe('FontAwesomeComponent', () => {
  let component: FontAwesomeComponent;
  let fixture: ComponentFixture<FontAwesomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FontAwesomeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontAwesomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
