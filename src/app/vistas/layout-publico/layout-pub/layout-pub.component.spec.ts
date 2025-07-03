import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutPubComponent } from './layout-pub.component';

describe('LayoutPubComponent', () => {
  let component: LayoutPubComponent;
  let fixture: ComponentFixture<LayoutPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutPubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutPubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
