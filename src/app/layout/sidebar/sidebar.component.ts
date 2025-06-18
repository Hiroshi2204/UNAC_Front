import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { RouteInfo } from './sidebar.metadata';
import { TranslateModule } from '@ngx-translate/core';
import { FeatherModule } from 'angular-feather';
import { NgScrollbar } from 'ngx-scrollbar';
import { AuthService } from '@core';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass'],
  imports: [
    RouterLink,
    NgScrollbar,
    RouterLinkActive,
    NgClass,
    FeatherModule,
    TranslateModule,
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  nombre_oficina: any;
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  routerObj;
  openedMenu: any = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private router: Router,
    private sidebarService: SidebarService
  ) {
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.renderer.removeClass(this.document.body, 'overlay-open');
        this.sidebbarClose();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    if (window.innerWidth < 1025) {
      this.renderer.removeClass(this.document.body, 'side-closed');
    }
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
      this.sidebbarClose();
    }
  }

  callToggleMenu(event: Event, length: number,) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }

  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    let userRol = null;

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userRol = user?.rol_id ?? user?.rol?.id ?? null;
      } catch (e) {
        console.error('Error al parsear usuario', e);
      }
    }

    if (this.authService.currentUserValue) {
      this.sidebarService.getRouteInfo().subscribe((routes: RouteInfo[]) => {
        this.sidebarItems = routes.filter((sidebarItem: any) => {
          return !sidebarItem.rol || (Array.isArray(sidebarItem.rol) && sidebarItem.rol.includes(userRol));
        });
      });
    }

    this.nombre_oficina = this.getNombreUsuario();
    if (this.nombre_oficina) {
      console.log('Nombre de usuario:', this.nombre_oficina);
    } else {
      console.log('No se pudo obtener el nombre de usuario.');
    }

    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }

  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }

  initLeftSidebar() {
    this.setMenuHeight();
    this.checkStatuForResize(true);
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }

  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'sidebar-gone');
    } else {
      this.renderer.removeClass(this.document.body, 'sidebar-gone');
    }
  }

  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }

  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }

  sidebbarClose() {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'sidebar-gone');
    }
  }

  getNombreUsuario(): string | null {
    try {
      const userData = localStorage.getItem('currentUser');
      if (!userData) {
        return null;
      }

      const user = JSON.parse(userData);
      return user.oficina?.nombre || null;
    } catch (error) {
      console.error('Error al leer el usuario desde localStorage:', error);
      return null;
    }
  }

  
}
