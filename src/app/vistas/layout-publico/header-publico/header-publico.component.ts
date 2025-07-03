import { Component, HostBinding, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopbarService } from '../topbar.service';


@Component({
  selector: 'app-header-publico',
  imports: [CommonModule, RouterModule],
  templateUrl: './header-publico.component.html',
  styleUrl: './header-publico.component.scss'
})
export class HeaderPublicoComponent {

  mobileOpen = signal(false);

  /** desplazamiento dinámico: 34 px si topbar visible, 0 px si no */
  @HostBinding('style.--navbar-offset')
  offset = computed(() =>
    this.topbar.visibleSignal() ? '34px' : '0px'
  );

  constructor(private topbar: TopbarService) {}

  toggleMobile(): void {
    this.mobileOpen.update(o => !o);
  }

}
