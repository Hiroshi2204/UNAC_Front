import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIconsComponent } from './material-icons.component';

describe('MaterialIconsComponent', () => {
  let component: MaterialIconsComponent;
  let fixture: ComponentFixture<MaterialIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MaterialIconsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
