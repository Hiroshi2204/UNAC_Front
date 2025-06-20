import { Component, OnInit } from '@angular/core';
import { DocService } from '@core/service/doc.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-publicados',
  standalone: true,
  imports: [NgxDatatableModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './publicados.component.html',
  styleUrl: './publicados.component.scss'
})
export class PublicadosComponent implements OnInit {
  dataLoaded: boolean = false;
  oficios: any[] = [];
  todosLosOficios: any[] = [];
  loadingIndicator = true;
  filtroBusqueda: string = '';
  reorderable = true;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 0;

  constructor(
    private docService: DocService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingIndicator = true;
    this.dataLoaded = false;
    this.cargarOficios();
  }

  cargarOficios() {
    this.docService.getOficiospublicados().subscribe({
      next: (res) => {
        const oficiosOrdenados = res.oficios.sort((a: any, b: any) =>
          new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
        );

        this.todosLosOficios = oficiosOrdenados;
        this.totalPaginas = Math.ceil(this.todosLosOficios.length / this.itemsPorPagina);
        this.paginaActual = 1;
        this.actualizarPaginacion();

        this.loadingIndicator = false;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.error('Error al cargar oficios:', err);
        this.loadingIndicator = false;
      }
    });
  }

  actualizarPaginacion() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.oficios = this.todosLosOficios.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  filtrarOficios() {
    const termino = this.filtroBusqueda.toLowerCase().trim();

    if (!this.todosLosOficios || !Array.isArray(this.todosLosOficios)) {
      this.oficios = [];
      return;
    }

    const oficiosFiltrados = this.todosLosOficios.filter((oficio) => {
      const numero = oficio?.numero?.toLowerCase() || '';
      const codigo = oficio?.codigo?.toLowerCase() || '';
      const fecha_envio = oficio?.fecha_envio?.toLowerCase?.() || '';
      const pdf = oficio?.nombre_original_pdf?.toLowerCase() || '';
      const estado = oficio.estado_publicacion ? 'publicado' : 'no publicado';

      return (
        numero.includes(termino) ||
        codigo.includes(termino) ||
        fecha_envio.includes(termino) ||
        pdf.includes(termino) ||
        estado.includes(termino)
      );
    });

    // Ordenar por fecha descendente
    this.todosLosOficios = oficiosFiltrados.sort((a: any, b: any) =>
      new Date(b.fecha_envio || 0).getTime() - new Date(a.fecha_envio || 0).getTime()
    );

    this.totalPaginas = Math.ceil(this.todosLosOficios.length / this.itemsPorPagina);
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  abrirOficio(id: number) {
    this.router.navigate(['/apps/editar-oficio'], { queryParams: { id } });
  }

  despublicarOficio(id: number) {
    if (!confirm('¿Estás seguro de despublicar este oficio?')) return;

    this.loadingIndicator = true;

    this.docService.despublicar(id).subscribe({
      next: () => {
        this.cargarOficios();
      },
      error: (err) => {
        console.error('Error al despublicar', err);
        this.loadingIndicator = false;
      }
    });
  }
}
