import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadMailComponent } from './read-mail.component';

describe('ReadMailComponent', () => {
  let component: ReadMailComponent;
  let fixture: ComponentFixture<ReadMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReadMailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
