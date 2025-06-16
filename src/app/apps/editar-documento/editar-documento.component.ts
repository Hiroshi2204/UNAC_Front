import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatDialogModule } from '@angular/material/dialog';
import { DocService } from '@core/service/doc.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Modal1Component } from 'app/modal1/modal1.component';
import { EditarOficioComponent } from '../editar-oficio/editar-oficio.component';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-editar-documento',
  imports: [NgxDatatableModule, FormsModule, CommonModule,MatDialogModule,RouterLink],
  templateUrl: './editar-documento.component.html',
  styleUrl: './editar-documento.component.scss'
})
export class EditarDocumentoComponent implements OnInit {
    dataLoaded: boolean = false; 
    oficios: any[] = [];
    loadingIndicator = true;
    reorderable = true;

  constructor(private docService: DocService , private dialog: MatDialog , private router: Router) { }
 

  ngOnInit(): void {
    this.loadingIndicator = true;
    this.dataLoaded = false;
    this.cargarOficios();
  }

  cargarOficios() {
    this.docService.getOficios1().subscribe({
      next: (res) => {
        // Ajusta según la estructura que regresa tu API
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
}
