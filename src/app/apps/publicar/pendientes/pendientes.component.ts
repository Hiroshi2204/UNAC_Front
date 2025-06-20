import { Component, OnInit } from '@angular/core';
import { DocService } from '@core/service/doc.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.component.html',
  styleUrl: './pendientes.component.scss',
  standalone: true,
  imports: [NgxDatatableModule, FormsModule, CommonModule],
})
export class PendientesComponent implements OnInit {
  dataLoaded: boolean = false;
  todosLosOficios: any[] = [];
  oficiosFiltrados: any[] = [];
  oficiosPaginados: any[] = [];
  filtroBusqueda: string = '';
  loadingIndicator: boolean = true;

  seleccionados: boolean[] = [];
  todosSeleccionados: boolean = false;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 0;

  constructor(private docService: DocService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.cargarOficios();
  }

  cargarOficios(): void {
    this.loadingIndicator = true;
    this.docService.getOficiosPendientes().subscribe({
      next: (res) => {
        this.todosLosOficios = res.oficios;
        this.actualizarFiltroYPagina();
        this.loadingIndicator = false;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.error('Error al cargar oficios:', err);
        this.loadingIndicator = false;
      }
    });
  }

  actualizarFiltroYPagina(): void {
    const termino = this.filtroBusqueda.toLowerCase().trim();
    this.oficiosFiltrados = this.todosLosOficios.filter(oficio => {
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

    this.totalPaginas = Math.ceil(this.oficiosFiltrados.length / this.itemsPorPagina);
    this.cambiarPagina(1);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.oficiosPaginados = this.oficiosFiltrados.slice(inicio, fin);
    this.seleccionados = this.oficiosPaginados.map(() => false);
    this.todosSeleccionados = false;
  }

  buscar(): void {
    this.paginaActual = 1;
    this.actualizarFiltroYPagina();
  }

  abrirOficio(id: number): void {
    this.router.navigate(['/apps/editar-oficio'], { queryParams: { id } });
  }

  seleccionarTodos(valor: boolean): void {
    this.todosSeleccionados = valor;
    this.seleccionados = this.oficiosPaginados.map(() => valor);
  }

  actualizarSeleccionGeneral(): void {
    const total = this.seleccionados.length;
    const marcados = this.seleccionados.filter(s => s).length;
    this.todosSeleccionados = total > 0 && marcados === total;
  }

  get haySeleccionados(): boolean {
    return this.seleccionados.some(s => s);
  }

  publicarSeleccionados(): void {
    const idsSeleccionados = this.oficiosPaginados
      .map((oficio, i) => this.seleccionados[i] ? oficio.id : null)
      .filter(id => id !== null);

    if (idsSeleccionados.length === 0) return;

    this.loadingIndicator = true;

    this.docService.publicar({ ids: idsSeleccionados }).subscribe({
      next: () => {
        this.cargarOficios();
      },
      error: (err) => {
        console.error('Error al publicar oficios:', err);
        this.loadingIndicator = false;
      }
    });
  }
}
