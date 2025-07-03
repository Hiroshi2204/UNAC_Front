import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {

   @Input({ required: true }) title!: string;

  /** Ruta de la imagen de fondo */
  @Input() image = '/assets/img/hero-default.jpg';

  /** Altura opcional, por si una página la necesita más baja/alta */
  @Input() height = '220px';

}
