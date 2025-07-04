import { Component } from '@angular/core';
import { TopbarService } from '../topbar.service';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { HeaderPublicoComponent } from '../header-publico/header-publico.component';
import { RouterOutlet } from '@angular/router';
/* import { SidebarPublicoComponent } from '../sidebar-publico/sidebar-publico.component'; */
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'app-layout-pub',
  imports: [
    CommonModule,
    RouterOutlet,
    TopBarComponent,
    HeaderPublicoComponent,
    BannerComponent,
    
   
    
  ],
  templateUrl: './layout-pub.component.html',
  styleUrl: './layout-pub.component.scss'
})
export class LayoutPubComponent {

  topbarVisible$ = this.topbar.visible$;
  constructor(private topbar: TopbarService) {}

}
