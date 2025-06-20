import { Component, OnInit } from '@angular/core';
import { DocService } from '@core/service/doc.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editar-documento',
  standalone: true,
  imports: [NgxDatatableModule, FormsModule, CommonModule, MatDialogModule, RouterLink],
  templateUrl: './editar-documento.component.html',
  styleUrl: './editar-documento.component.scss'
})
export class EditarDocumentoComponent implements OnInit {
  loadingIndicator = true;
  dataLoaded = false;

  todosLosOficios: any[] = [];
  filtroBusqueda: string = '';

  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  constructor(
    private docService: DocService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarTodosLosOficios();
  }

  get oficiosFiltrados(): any[] {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    if (!termino) return this.todosLosOficios;

    return this.todosLosOficios.filter((oficio) => {
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

  get oficiosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.oficiosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.oficiosFiltrados.length / this.itemsPorPagina);
  }

  cargarTodosLosOficios(): void {
    this.loadingIndicator = true;
    this.docService.getOficios1().subscribe({
      next: (res) => {
        this.todosLosOficios = res.oficios || res; // depende de tu API
        this.todosLosOficios = res.oficios.sort((a: any, b: any) =>
          new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
        );
        this.loadingIndicator = false;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.error('Error al cargar oficios:', err);
        this.loadingIndicator = false;
      }
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  buscar() {
    this.paginaActual = 1;
  }

  abrirOficio(id: number): void {
    this.router.navigate(['/apps/editar-oficio'], { queryParams: { id } });
  }
}
