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
  seleccionados: boolean[] = [];
  todosSeleccionados: boolean = false;


  constructor(private docService: DocService, private dialog: MatDialog, private router: Router) { }


  ngOnInit(): void {
    this.loadingIndicator = true;
    this.dataLoaded = false;
    this.cargarOficios();
    
  }

  cargarOficios() {
    this.docService.getOficiosPendientes().subscribe({
      next: (res) => {
        // Ajusta según la estructura que regresa tu API
        this.todosLosOficios = [...res.oficios];
        this.oficios = res.oficios;
        this.loadingIndicator = false; // ✅ Apagar loader aquí
        this.dataLoaded = true;
        //console.log(this.oficios)
        this.seleccionados = this.oficios.map(() => false);
        this.todosSeleccionados = false;
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

  seleccionarTodos(valor: boolean) {
    this.todosSeleccionados = valor;
    this.seleccionados = this.oficios.map(() => valor);
  }

  actualizarSeleccionGeneral() {
    const total = this.seleccionados.length;
    const marcados = this.seleccionados.filter(s => s).length;
    this.todosSeleccionados = total > 0 && marcados === total;
  }

  get haySeleccionados(): boolean {
    return this.seleccionados.some(s => s); // true si al menos uno está en true
  }

  publicarSeleccionados() {
    const idsSeleccionados = this.oficios
      .map((oficio, i) => this.seleccionados[i] ? oficio.id : null)
      .filter(id => id !== null);

    if (idsSeleccionados.length === 0) return;

    this.loadingIndicator = true;

    this.docService.publicar({ ids: idsSeleccionados }).subscribe({
      next: () => {
        this.cargarOficios(); // 🔁 Refrescamos después de publicar
      },
      error: (err) => {
        console.error('Error al publicar oficios:', err);
        this.loadingIndicator = false;
      }
    });
  }

}
