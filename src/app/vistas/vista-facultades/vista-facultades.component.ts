import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';

import { VistasService } from '@core/service/vistas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vista-facultades',
  standalone: true,
  imports: [NgxDatatableModule, FormsModule, CommonModule],
  templateUrl: './vista-facultades.component.html',
  styleUrl: './vista-facultades.component.scss'
})
export class VistaFacultadesComponent implements OnInit {
  dataLoaded = false;
  rows: any[] = [];
  totalItems = 0;
  paginaActual = 1;
  itemsPorPagina = 10;
  usuario_admin = false;
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  total_paginas!: number;
  documentosFacultades: any[] = [];
  mostrarTablaGeneral = true;

  filtros = {
    nombre: '',
    num_documento: '',
    fecha: '',
    fecha_inicio: '',
    fecha_fin: '',
    resumen: '',
    detalle: '',
    oficina_remitente: ''
  };

  oficinas!: any[];
  ordenCampo = '';
  ordenDireccion = '';

  @ViewChild('table') table!: DatatableComponent;

  constructor(private docService: VistasService) {}

  ngOnInit(): void {
    this.loadingIndicator = false;
    this.dataLoaded = false;
    this.getOficinas();

    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const usuario = JSON.parse(userData);
      this.usuario_admin = usuario?.rol?.rol === 'ADMIN';
    }


    this.listar_documentosFacultades();

    
  }


  listar_documentosFacultades() {

    this.docService.getDocumentosFacultades().subscribe({
      next: (res) => {
        this.documentosFacultades = (res.documentos || [])
          .sort((a: any, b: any) => new Date(b.fecha_doc).getTime() - new Date(a.fecha_doc).getTime())
          .slice(0, 20) // ✅ Limitar carga a 20 documentos
          .map((doc: any) => {
            const fechaOriginal = doc.fecha_doc;
            const fechaFormateada = fechaOriginal
              ? fechaOriginal.substring(8, 10) + '/' + fechaOriginal.substring(5, 7) + '/' + fechaOriginal.substring(0, 4)
              : '';
            return {
              ...doc,
              fecha_doc: fechaFormateada,
              archivo_pdf: doc.pdf_path
            };
          });
      },
      error: (err) => {
        console.error('Error al obtener documentos por facultad', err);
      }
    });


  }

  get_documentosFacultades() {


    
  }

  getOficinas() {
    this.docService.getOficinasFacultades().subscribe({
      next: (res) => {
        this.oficinas = res.documentos;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  buscarDocumento(pagina: number): void {
    const valoresFiltros = Object.values(this.filtros).map(v => (v ?? '').toString().trim());
    const hayFiltro = valoresFiltros.some(v => v && v !== '');

    if (!hayFiltro) {
      alert('Por favor ingrese al menos un criterio de búsqueda.');
      return;
    }

    this.mostrarTablaGeneral = false;
    this.dataLoaded = false;
    this.loadingIndicator = true;

    const { nombre, num_documento, resumen, detalle, fecha, fecha_inicio, fecha_fin, oficina_remitente } = this.filtros;

    this.docService.vistarDocFacultades(
      nombre.trim(),
      num_documento.trim(),
      resumen.trim(),
      detalle.trim(),
      fecha.trim(),
      fecha_inicio.trim(),
      fecha_fin.trim(),
      this.ordenCampo,
      this.ordenDireccion,
      oficina_remitente,
      pagina
    ).subscribe({
      next: (respuesta) => {
        if (!respuesta || !respuesta.data || respuesta.data.length === 0) {
          this.rows = [];
          this.totalItems = 0;
          this.paginaActual = 1;
          this.loadingIndicator = false;
          this.dataLoaded = true;
          return;
        }

        this.rows = respuesta.data.map((doc: any) => {
          const fechaOriginal = doc.fecha_doc;
          const fechaFormateada = fechaOriginal
            ? fechaOriginal.substring(8, 10) + '/' + fechaOriginal.substring(5, 7) + '/' + fechaOriginal.substring(0, 4)
            : '';
          return {
            ...doc,
            fecha_doc: fechaFormateada,
            archivo_pdf: doc.pdf_path
          };
        });

        this.total_paginas = respuesta.last_page;
        this.totalItems = respuesta.total;
        this.paginaActual = respuesta.current_page;
        this.loadingIndicator = false;
        this.dataLoaded = true;
      },
      error: (err) => {
        console.error('Error al buscar documentos:', err);
        alert('Ocurrió un error al buscar documentos.');
        this.loadingIndicator = false;
        this.dataLoaded = true;
      }
    });
  }

  descargarDoc(id: any, nombre: any) {
    this.docService.descargar_documentos(id).subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar documentos:', err);
      }
    });
  }

  onPageChange(event: any): void {
    const nuevaPagina = event.offset + 1;
    this.buscarDocumento(nuevaPagina);
  }

  onSort(event: any) {
    const sort = event.sorts[0];
    this.ordenCampo = sort.prop;
    this.ordenDireccion = sort.dir;
    this.buscarDocumento(this.paginaActual);
  }

  getPaginasParaMostrar(): (number | string)[] {
    const total = this.total_paginas;
    const actual = this.paginaActual;
    const delta = 2;
    const paginas: (number | string)[] = [];

    const mostrarIzquierda = Math.max(2, actual - delta);
    const mostrarDerecha = Math.min(total - 1, actual + delta);

    paginas.push(1);

    if (mostrarIzquierda > 2) {
      paginas.push('...');
    }

    for (let i = mostrarIzquierda; i <= mostrarDerecha; i++) {
      paginas.push(i);
    }

    if (mostrarDerecha < total - 1) {
      paginas.push('...');
    }

    if (total > 1) {
      paginas.push(total);
    }

    return paginas;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }
}
