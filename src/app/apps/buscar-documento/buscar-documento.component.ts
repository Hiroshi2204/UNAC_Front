import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DocService } from '@core/service/doc.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscar-documento',
  imports: [ NgxDatatableModule, FormsModule, CommonModule],
  templateUrl: './buscar-documento.component.html',
  styleUrl: './buscar-documento.component.scss'
})
export class BuscarDocumentoComponent implements OnInit{
  dataLoaded: boolean = false; // nuevo flag
  terminoBusqueda: string = '';
  rows: any[] = [];
  totalItems: number = 0;
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table!: DatatableComponent;

  constructor(  private docService: DocService) {
    
  }

  ngOnInit(): void {

    
    
  }

  descargarDoc(id:any, nombre:any) {
    console.log(id, nombre)
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

  eliminarDocumento(id:any){
    this.docService.eliminarDoc(id).subscribe({
      next: (res) => {
        console.log("archivo eliminado")
      },
      error: (err) => {
        console.error(err)
      }
    })

  }


  buscarDocumento(pagina: number): void {
  if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
    alert('Por favor ingrese un término de búsqueda.');
    return;
  }

  this.dataLoaded = false;
  this.loadingIndicator = true;

  this.docService.buscarDoc({ q: this.terminoBusqueda }, pagina).subscribe({
    next: (res) => {
      // Ahora asumimos que res es un objeto, no un arreglo
      const respuesta = res; // directamente asignar

      if (!respuesta || !respuesta.data || respuesta.data.length === 0) {
        this.rows = [];
        this.totalItems = 0;
        this.paginaActual = 1;
        this.loadingIndicator = false;
        this.dataLoaded = true;
        return;
      }

      this.rows = respuesta.data.map((doc: any) => ({
        ...doc,
        archivo_pdf: doc.pdf_path
      }));

      this.totalItems = respuesta.total;
      this.paginaActual = respuesta.current_page;
      this.loadingIndicator = false;
      this.dataLoaded = true;
      console.log(this.rows)
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

  


  @HostListener('window:resize', ['$event'])
  onResize(): void {
  this.scrollBarHorizontal = window.innerWidth < 1200;
  if (this.table) {
    this.table.recalculate();
    this.table.recalculateColumns();
  }
}
}