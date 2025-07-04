import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import dayjs from 'dayjs';
import { DocService } from '@core/service/doc.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscar-documento',
  imports: [NgxDatatableModule, FormsModule, CommonModule],
  templateUrl: './buscar-documento.component.html',
  styleUrl: './buscar-documento.component.scss'
})
export class BuscarDocumentoComponent implements OnInit {
  dataLoaded: boolean = false; // nuevo flag

  rows: any[] = [];
  totalItems: number = 0;
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  usuario_admin: boolean = false;
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  total_paginas!: number
  filtros = {
    nombre: '',
    num_documento: '',
    fecha: '', // fecha exacta (opcional)
    fecha_inicio: '', // nueva propiedad
    fecha_fin: '',    // nueva propiedad
    resumen: '',
    detalle: '',
    oficina_remitente: ''
  };
  oficinas!: any[]
  ordenCampo: string = '';
  ordenDireccion: string = '';

  @ViewChild('table') table!: DatatableComponent;

  constructor(private docService: DocService) {

  }

  ngOnInit(): void {

    this.loadingIndicator = false;
    this.dataLoaded = false;
    this.getOficinasId();

    //validar que el usuario sea admin para mostrar el boton eliminar
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      const usuario = JSON.parse(userData);

      this.usuario_admin = usuario?.rol?.rol === 'ADMIN';

    }



  }

  descargarDoc(id: any, nombre: any) {
    //console.log(id, nombre)
    this.docService.descargar_documentos(id).subscribe({
      next: (res: Blob) => {
        // Crear enlace de descarga
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = nombre; // Puedes cambiar el nombre si tienes uno dinámico
        a.click();

        window.URL.revokeObjectURL(url); // Limpieza
        console.log('Documento descargado');
      },
      error: (err) => {
        console.error('Error al descargar documentos:', err);
      }
    });
  }

  getOficinasId() {
    this.docService.getOficinas(1).subscribe({
      next: (res) => {
        console.log(res)
        this.oficinas = res.documentos
      },
      error: (err) => {
        console.log(err)
      }
    })

  }

  eliminarDocumento(id: any) {
    this.docService.eliminarDoc(id).subscribe({
      next: () => {
        console.log("archivo eliminado");
        this.buscarDocumento(this.paginaActual);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  buscarDocumento(pagina: number): void {
    // Validar que al menos un filtro tenga valor
    const valoresFiltros = Object.values(this.filtros).map(v => (v ?? '').toString().trim());
    const hayFiltro = valoresFiltros.some(v => v && v !== '');

    if (!hayFiltro) {
      alert('Por favor ingrese al menos un criterio de búsqueda.');
      return;
    }

    this.dataLoaded = false;
    this.loadingIndicator = true;

    // Extraer y limpiar filtros individuales
    const nombre = this.filtros.nombre?.trim() || '';
    const numero = this.filtros.num_documento?.trim() || '';
    const resumen = this.filtros.resumen?.trim() || '';
    const detalle = this.filtros.detalle?.trim() || '';
    const fecha_doc = this.filtros.fecha?.trim() || '';
    const fecha_inicio = this.filtros.fecha_inicio?.trim() || '';
    const fecha_fin = this.filtros.fecha_fin?.trim() || '';
    const oficina_id = this.filtros.oficina_remitente || '';


    // Llamar al servicio con los filtros individuales
    this.docService.buscarDoc(nombre, numero, resumen, detalle, fecha_doc, fecha_inicio, fecha_fin, this.ordenCampo, this.ordenDireccion, oficina_id, pagina).subscribe({
      next: (res) => {
        const respuesta = res;
        console.log(respuesta)
        console.log(oficina_id)

        if (!respuesta || !respuesta.data || respuesta.data.length === 0) {
          this.rows = [];
          this.totalItems = 0;
          this.paginaActual = 1;
          this.loadingIndicator = false;
          this.dataLoaded = true;
          return;
        }

        // this.rows = respuesta.data.map((doc: any) => ({
        //   ...doc,
        //   archivo_pdf: doc.pdf_path
        // }));

        this.rows = respuesta.data.map((doc: any) => {
          const fechaFormateada = doc.fecha_doc
            ? dayjs(doc.fecha_doc).format('DD/MM/YYYY')
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
        console.log(this.rows);
      },
      error: (err) => {
        console.error('Error al buscar documentos:', err);
        alert('Ocurrió un error al buscar documentos.');
        this.loadingIndicator = false;
        this.dataLoaded = true;
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