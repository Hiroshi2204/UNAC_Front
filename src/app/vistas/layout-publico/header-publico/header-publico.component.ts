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

 

  constructor(private topbar: TopbarService) {}

 
  

}
