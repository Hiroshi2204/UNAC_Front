import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
interface Crumb { label: string; url: string; }

@Component({
  selector: 'app-banner',
  imports: [RouterLink, CommonModule], 
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {

  @Input() titulo = 'Título por defecto';
  @Input() breadcrumbs: Crumb[] = [];
}
