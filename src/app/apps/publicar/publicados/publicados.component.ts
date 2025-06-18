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
  selector: 'app-publicados',
  imports: [NgxDatatableModule, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './publicados.component.html',
  styleUrl: './publicados.component.scss'
})
export class PublicadosComponent {
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
    this.docService.getOficiospublicados().subscribe({
      next: (res) => {
        const oficiosOrdenados = res.oficios.sort((a: any, b: any) =>
          new Date(b.fecha_envio).getTime() - new Date(a.fecha_envio).getTime()
        );
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

  // filtrarOficios() {
  //   const termino = this.filtroBusqueda.toLowerCase().trim();
  //   this.oficios = this.todosLosOficios.filter((oficio) => {
  //     const numero = oficio?.numero?.toLowerCase() || '';
  //     const codigo = oficio?.codigo?.toLowerCase() || '';
  //     const pdf = oficio?.nombre_original_pdf?.toLowerCase() || '';
  //     const estado = oficio.estado_publicacion ? 'publicado' : 'no publicado';
  //     return (
  //       numero.includes(termino) ||
  //       codigo.includes(termino) ||
  //       pdf.includes(termino) ||
  //       estado.includes(termino)
  //     );
  //   });
  // }
  filtrarOficios() {
    const termino = this.filtroBusqueda.toLowerCase().trim();

    // Asegúrate de que todosLosOficios esté definido y sea un array
    if (!this.todosLosOficios || !Array.isArray(this.todosLosOficios)) {
      this.oficios = [];
      return;
    }

    // Filtrado
    const oficiosFiltrados = this.todosLosOficios.filter((oficio) => {
      const numero = oficio?.numero?.toLowerCase() || '';
      const codigo = oficio?.codigo?.toLowerCase() || '';
      const fecha_envio = oficio?.fecha_envio?.toLowerCase() || '';
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

    // Ordenar por fecha_envio descendente
    this.oficios = oficiosFiltrados.sort((a: any, b: any) =>
      new Date(b.fecha_envio || 0).getTime() - new Date(a.fecha_envio || 0).getTime()
    );
  }

  despublicarOficio(id: number) {
    if (!confirm('¿Estás seguro de despublicar este oficio?')) return;

    this.loadingIndicator = true;

    this.docService.despublicar(id).subscribe({
      next: (res) => {
        console.log('Despublicado correctamente');
        this.cargarOficios(); // Refresca la lista
      },
      error: (err) => {
        console.error('Error al despublicar', err);
        this.loadingIndicator = false;
      }
    });
  }

}
