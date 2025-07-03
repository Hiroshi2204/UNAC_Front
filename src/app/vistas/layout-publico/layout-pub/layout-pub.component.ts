import { Component } from '@angular/core';
import { TopbarService } from '../topbar.service';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { HeaderComponent } from 'app/layout/header/header.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-layout-pub',
  imports: [
    CommonModule,
    RouterOutlet,
    TopBarComponent,
    HeaderComponent,
  ],
  templateUrl: './layout-pub.component.html',
  styleUrl: './layout-pub.component.scss'
})
export class LayoutPubComponent {

  topbarVisible$ = this.topbar.visible$;
  constructor(private topbar: TopbarService) {}

}
