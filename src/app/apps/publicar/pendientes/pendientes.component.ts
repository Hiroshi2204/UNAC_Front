import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { DocService } from '@core/service/doc.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Modal1Component } from 'app/modal1/modal1.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pendientes',
   imports: [NgxDatatableModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './pendientes.component.html',
  styleUrl: './pendientes.component.scss'
})
export class PendientesComponent {
  dataLoaded: boolean = false;
  oficios: any[] = [];
  loadingIndicator = true;
  reorderable = true;
  filtroBusqueda: string = '';
  todosLosOficios: any[] = [];


  constructor(private docService: DocService, private dialog: MatDialog, private router: Router) { }


  ngOnInit(): void {
    this.loadingIndicator = true;
    this.dataLoaded = false;
    this.cargarOficios();
    
  }

  cargarOficios() {
    this.docService.getOficios1().subscribe({
      next: (res) => {
        // Ajusta según la estructura que regresa tu API
        this.todosLosOficios = [...res.oficios];
        this.oficios = res.oficios;
        this.loadingIndicator = false; // ✅ Apagar loader aquí
        this.dataLoaded = true;
        //console.log(this.oficios)
      },
      error: (err) => {
        console.error('Error al cargar oficios:', err);
        this.loadingIndicator = false; // También apagar si hay error
      }
    });
  }
  abrirOficio(id: number) {
    this.router.navigate(['/apps/editar-oficio'], { queryParams: { id } });
  }

  filtrarOficios() {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    this.oficios = this.todosLosOficios.filter((oficio) => {
      const numero = oficio?.numero?.toLowerCase() || '';
      const codigo = oficio?.codigo?.toLowerCase() || '';
      const pdf = oficio?.nombre_original_pdf?.toLowerCase() || '';
      const estado = oficio.estado_publicacion ? 'publicado' : 'no publicado';
      return (
        numero.includes(termino) ||
        codigo.includes(termino) ||
        pdf.includes(termino) ||
        estado.includes(termino)
      );
    });
  }

}
