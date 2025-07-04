import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { DocService } from '@core/service/doc.service';
import { ViewChild, ElementRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-documento',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})

export class DocumentoComponent implements OnInit {
  documentoForm!: FormGroup;
  oficioFile: File | null = null;
  resolucionFiles: File[] = [];
  activeTab: number = 0;
  pasoActual: number = 1;
  tiposDocumento: any[] = [];
  documentos_existentes: any[] = [];
  oficios_existentes: any[] = [];  // Agregado para almacenar los documentos existentes
  numeroExistenteMensaje: string = '';
  numeroExistenteMensajeOficio: string = ''; // Agregado para el mensaje de advertencia
  numeroExistenteMensajesResolucion: string[] = [];
  loading: boolean = false;
  @ViewChild('oficioInput') oficioInputRef!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private docService: DocService, private cdr: ChangeDetectorRef) { }

  fechaHoy: string = '';

  ngOnInit(): void {
    this.cargarTiposDocumento();
    this.cargar_oficios_existentes();

    this.fechaHoy = this.formatearFecha(new Date());

    this.documentoForm = this.fb.group({
      oficio: this.fb.group({
        numero: ['', Validators.required],
        cantidad_resoluciones: [null, [Validators.required, Validators.min(1)]],
        //fecha_doc: ['', Validators.required],
      }),
      resoluciones: this.fb.array([]),
    });
    this.cargar_oficios_existentes().then(() => {
      this.documentoForm.get('oficio.numero')?.valueChanges.subscribe(valor => {
        this.buscarOficiosCoincidencias(valor);
        this.buscarCoincidencias(valor, 'oficio');
      });
    });


  }

  formatearFecha(fecha: Date): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    return `${dia} de ${mes} ${anio}`;
  }

  buscarOficiosCoincidencias(valor: any) {
    if (!valor) {
      this.numeroExistenteMensajeOficio = '';
      return;
    }

    const numeroIngresado = String(valor).replace(/^0+/, '').toLowerCase();

    const coincidencias = this.oficios_existentes.filter(doc => {
      const numeroDoc = String(doc.numero)?.replace(/^0+/, '').toLowerCase();
      return numeroDoc === numeroIngresado;
    });

    if (coincidencias.length > 0) {
      const coincidenciasTexto = coincidencias.map(c => c.codigo).join(', ');
      this.numeroExistenteMensajeOficio = `Ya existe un oficio con el número "${numeroIngresado}"`;
    } else {
      this.numeroExistenteMensajeOficio = '';
    }
    this.cdr.detectChanges();
  }

  buscarCoincidencias(valor: string, tipo: string) {
    if (!valor) return;

    const numeroIngresado = String(valor).replace(/^0+/, '');


    const coincidencias = this.documentos_existentes.filter(doc => {
      const numeroDoc = doc.num_anio?.split('-')[0]?.replace(/^0+/, '');
      return numeroDoc === numeroIngresado;
    });

    if (tipo.startsWith('resolucion-')) {
      const index = parseInt(tipo.split('-')[1], 10);
      if (coincidencias.length > 0) {
        const coincidenciasTexto = coincidencias.map(c => c.num_anio).join(', ');
        this.numeroExistenteMensajesResolucion = [
          ...this.numeroExistenteMensajesResolucion.slice(0, index),
          `Ya existe un documento con el número ${numeroIngresado} (${coincidenciasTexto})`,
          ...this.numeroExistenteMensajesResolucion.slice(index + 1),
        ];
      } else {
        this.numeroExistenteMensajesResolucion = [
          ...this.numeroExistenteMensajesResolucion.slice(0, index),
          '',
          ...this.numeroExistenteMensajesResolucion.slice(index + 1),
        ];
      }
    }
  }

  cargarTiposDocumento() {
    this.docService.getTipoDoc().subscribe({
      next: (res) => {
        console.log('Respuesta de API:', res);
        this.tiposDocumento = res.documentos;
      },
      error: (err) => {
        console.error('Error cargando tipos de documento', err);
        alert('Error al cargar tipos de documento');
      }
    });
  }

  cargar_oficios_existentes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.docService.getOficios().subscribe({
        next: (res) => {
          this.oficios_existentes = res.oficios;
          resolve();
        },
        error: (err) => {
          console.error(err);
          reject(err);
        }
      });
    });
  }

  filtrar_documentos_existentes(id: any) {
    this.docService.getResolucionesPorOficina(id).subscribe({
      next: (res) => {
        this.documentos_existentes = res.documentos;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  get oficioForm(): FormGroup {
    return this.documentoForm.get('oficio') as FormGroup;
  }

  get resoluciones(): FormArray<FormGroup> {
    return this.documentoForm.get('resoluciones') as FormArray<FormGroup>;
  }

  agregarResolucionesSegunCantidad(): void {
    // Leer el número de resoluciones del formulario
    const cantidad = this.documentoForm.get('oficio.cantidad_resoluciones')?.value;

    if (!cantidad || cantidad <= 0) {
      alert('Por favor, ingresa un número válido de resoluciones.');
      return;
    }

    // Limpiar el FormArray de resoluciones
    this.resoluciones.clear();
    this.resolucionFiles = [];

    for (let i = 0; i < cantidad; i++) {
      const resolucionForm = this.fb.group({
        clase_documento_id: ['', Validators.required],
        nombre: ['', Validators.required],
        numero: ['', Validators.required],
        fecha: ['', Validators.required],
        resumen: [''],
        detalle: [''],
      });

      this.resoluciones.push(resolucionForm);
      this.numeroExistenteMensajesResolucion.push('');
      this.resolucionFiles.push(null!);

      resolucionForm.get('numero')?.valueChanges.subscribe(valor => {
        if (valor) {
          this.buscarCoincidencias(valor, `resolucion-${i}`);
        }
      });

      resolucionForm.get('clase_documento_id')?.valueChanges.subscribe(valor => {
        this.filtrar_documentos_existentes(valor);
      });
    }

    this.activeTab = 0;  // Seleccionar la primera pestaña activa
  }

  eliminarResolucion(index: number): void {
    this.resoluciones.removeAt(index);
    this.resolucionFiles.splice(index, 1);
    this.activeTab = 0;
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.oficioFile = fileInput.files[0];
    }
  }

  onResolucionFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.resolucionFiles[index] = fileInput.files[0];
    }
  }

  mostrarResumen(): void {
    this.pasoActual = 3;
  }

  subir_documento1() {
    const formData = new FormData();

    // Datos del oficio
    const oficioData = this.oficioForm.value;
    formData.append('numero_oficio', oficioData.numero);
    formData.append('fecha_ofi', oficioData.fecha_doc);
    if (this.oficioFile) {
      formData.append('pdf_oficio', this.oficioFile);
    }

    // Datos de resoluciones (documentos)
    this.resoluciones.controls.forEach((res, index) => {
      const documentoData = res.value;
      const documentoJSON = {
        clase_documento_id: documentoData.clase_documento_id,
        nombre: documentoData.nombre,
        numero: documentoData.numero,
        fecha: documentoData.fecha,
        resumen: documentoData.resumen || '',
        detalle: documentoData.detalle || '',
      };

      // Asegúrate de que el archivo se adjunte correctamente
      if (this.resolucionFiles[index]) {
        formData.append(`pdf_documento_${index}`, this.resolucionFiles[index]);
      }

      // Convertir el objeto del documento a un string y agregar al FormData
      formData.append(`documento_${index}`, JSON.stringify(documentoJSON));
    });

    // Verificar el contenido de FormData en consola
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Enviar al backend
    this.docService.cargar_documentos(formData).subscribe({
      next: res => {
        console.log(res);
        console.log("Subido correctamente");
      },
      error: err => {
        console.error('ERROR COMPLETO:', err);
        console.log('Código de error HTTP:', err.status);
        console.log("Error al subir");
      }
    });
  }
  subir_documento() {
    this.loading = true; // 🔁 Empieza a cargar
    const formData = new FormData();

    // Datos del oficio
    const oficioData = this.oficioForm.value;
    formData.append('numero_oficio', oficioData.numero);
    formData.append('fecha_ofi', oficioData.fecha_doc);
    if (this.oficioFile) {
      formData.append('pdf_oficio', this.oficioFile);
    }

    // Datos de resoluciones (documentos)
    this.resoluciones.controls.forEach((res, index) => {
      const documentoData = res.value;
      const documentoJSON = {
        clase_documento_id: documentoData.clase_documento_id,
        nombre: documentoData.nombre,
        numero: documentoData.numero,
        fecha: documentoData.fecha,
        resumen: documentoData.resumen || '',
        detalle: documentoData.detalle || '',
      };

      if (this.resolucionFiles[index]) {
        formData.append(`pdf_documento_${index}`, this.resolucionFiles[index]);
      }

      formData.append(`documento_${index}`, JSON.stringify(documentoJSON));
    });

    // Enviar al backend
    this.docService.cargar_documentos(formData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log("Subido correctamente", res);

        // Mensaje de éxito
        alert('✅ Oficio subido correctamente');

        // Limpiar formulario
        this.oficioForm.reset();

        // Limpiar archivos
        this.oficioFile = null;
        this.oficioInputRef.nativeElement.value = '';
        this.resolucionFiles = [];
        this.resoluciones.clear(); // limpia FormArray
        this.cargar_oficios_existentes();
        this.filtrar_documentos_existentes(oficioData.clase_documento_id); // si aplica

      },
      error: (err) => {
        this.loading = false;
        console.error('ERROR COMPLETO:', err);
        console.log('Código de error HTTP:', err.status);
        alert('❌ Error al subir el oficio');
      }
    });
  }


}