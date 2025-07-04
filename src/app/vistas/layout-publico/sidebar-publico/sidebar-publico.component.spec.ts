import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPublicoComponent } from './sidebar-publico.component';

describe('SidebarPublicoComponent', () => {
  let component: SidebarPublicoComponent;
  let fixture: ComponentFixture<SidebarPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarPublicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
