import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-principal',
  imports: [],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.scss'
})
export class MenuPrincipalComponent implements OnInit {
  ngOnInit(): void {
    // Aquí podrías cargar el nombre desde un servicio si lo necesitas
  }
}
