import { Component } from '@angular/core';
import { TopbarService } from '../topbar.service';

@Component({
  selector: 'app-layout-pub',
  imports: [],
  templateUrl: './layout-pub.component.html',
  styleUrl: './layout-pub.component.scss'
})
export class LayoutPubComponent {

  topbarVisible$ = this.topbar.visible$;
  constructor(private topbar: TopbarService) {}

}
