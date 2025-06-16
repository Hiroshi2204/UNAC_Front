import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DocService } from '@core/service/doc.service';

@Component({
  selector: 'app-editar-oficio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './editar-oficio.component.html',
  styleUrls: ['./editar-oficio.component.scss']
})
export class EditarOficioComponent implements OnInit {
  documentoForm!: FormGroup;
  oficio: any;
  oficioFile: File | null = null;
  resolucionFiles: File[] = [];
  activeTab: number = 0;
  pasoActual: number = 1;
  tiposDocumento: any[] = [];
  documentos_existentes: any[] = [];
  oficios_existentes: any[] = [];
  numeroExistenteMensaje: string = '';
  numeroExistenteMensajeOficio: string = '';
  fechaHoy: string = '';

  constructor(private router: Router, private fb: FormBuilder, private docService: DocService) {
    const nav = this.router.getCurrentNavigation();
    this.oficio = nav?.extras?.state?.['oficio'];
    if (this.oficio?.archivo) {
      this.oficioFile = {
        name: this.oficio.nombre_original_pdf
      } as File;
    }
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.fechaHoy = this.formatearFecha(new Date());
    this.cargarTiposDocumento();
    this.cargar_oficios_existentes();
    this.subscribirCambiosFormulario();

    if (this.oficio) {
      this.documentoForm.patchValue({
        oficio: {
        numero: this.oficio.numero || '',
        cantidad_resoluciones: this.oficio.cantidad_resoluciones || 1
      }
    });

    // Agregar resoluciones automáticamente desde la API
    this.cargarDatosOficio(this.oficio);
      }
  }

  inicializarFormulario() {
    this.documentoForm = this.fb.group({
      oficio: this.fb.group({
        numero: ['', Validators.required],
        cantidad_resoluciones: [null, [Validators.required, Validators.min(1)]]
      }),
      resoluciones: this.fb.array([])
    });
    if (this.oficio?.archivo) {
      this.oficioFile = {
        name: this.oficio.nombre_original_pdf
      } as File; // Mock del archivo solo para mostrar nombre
    }
  }

  get oficioForm() { return this.documentoForm.get('oficio') as FormGroup; }
  get resoluciones() { return this.documentoForm.get('resoluciones') as FormArray; }

  cargarDatosOficio(ofi: any) {
    this.oficioForm.patchValue({
      numero: ofi.numero,
      cantidad_resoluciones: ofi.resoluciones.length
    });
    this.resolucionFiles = new Array(ofi.resoluciones.length).fill(null);
    this.resoluciones.clear();

    ofi.resoluciones.forEach((r: any, i: number) => {
      const rg = this.fb.group({
        clase_documento_id: [r.clase_documento_id, Validators.required],
        nombre: [r.nombre, Validators.required],
        numero: [r.numero, Validators.required],
        fecha: [r.fecha, Validators.required],
        resumen: [r.resumen],
        detalle: [r.detalle],
        archivo: [null]
      });
      this.resoluciones.push(rg);
    });
    this.activeTab = 0;
  }

  subscribirCambiosFormulario() {
    this.oficioForm.get('numero')?.valueChanges.subscribe(v => this.buscarOficiosCoincidencias(v));
  }

  formatearFecha(fecha: Date): string {
    const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
  }

  cargarTiposDocumento() {
    this.docService.getTipoDoc().subscribe({
      next: res => this.tiposDocumento = res.documentos,
      error: () => alert('Error al cargar tipos de documento')
    });
  }

  cargar_oficios_existentes() {
    this.docService.getOficios().subscribe({
      next: res => this.oficios_existentes = res.documentos,
      error: err => console.error(err)
    });
  }

  buscarOficiosCoincidencias(val: string) {
    this.numeroExistenteMensajeOficio = '';
    const num = val?.replace(/^0+/,'');
    if (!num) return;
    const coinc = this.oficios_existentes.filter(d => d.codigo?.split('-')[0]?.replace(/^0+/,'') === num);
    if (coinc.length) {
      const txt = coinc.map(c => c.codigo).join(', ');
      this.numeroExistenteMensajeOficio = `Ya existe un oficio con el número ${num} (${txt})`;
    }
  }

  agregarResolucionesSegunCantidad() {
    const cant = this.oficioForm.get('cantidad_resoluciones')?.value;
    if (!cant || cant < 1) return alert('Ingresa un número válido');
    this.resoluciones.clear();
    this.resolucionFiles = [];
    for (let i = 0; i < cant; i++) {
      this.resoluciones.push(this.fb.group({
        clase_documento_id: ['', Validators.required],
        nombre: ['', Validators.required],
        numero: ['', Validators.required],
        fecha: ['', Validators.required],
        resumen: [''],
        detalle: [''],
        archivo: [null]
      }));
      this.resolucionFiles.push(null!);
    }
    this.activeTab = 0;
  }

  eliminarResolucion(i: number) {
    this.resoluciones.removeAt(i);
    this.resolucionFiles.splice(i, 1);
    this.activeTab = 0;
  }

  onFileChange(e: Event) {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) this.oficioFile = f[0];
  }

  onResolucionFileChange(e: Event, i: number) {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) this.resolucionFiles[i] = f[0];
  }

  get resolucionesFormGroups(): FormGroup[] {
    return this.resoluciones.controls as FormGroup[];
  }

  prueba_imprimir() {
    if (this.documentoForm.invalid) return alert('Completa campos obligatorios');
    const fd = new FormData();
    const ofi = this.oficioForm.value;
    fd.append('numero_oficio', ofi.numero);
    fd.append('cantidad_resoluciones', ofi.cantidad_resoluciones);
    if (this.oficioFile) fd.append('pdf_oficio', this.oficioFile);

    this.resoluciones.controls.forEach((res, i) => {
      const d = res.value;
      fd.append(`documento_${i}`, JSON.stringify(d));
      if (this.resolucionFiles[i]) fd.append(`pdf_documento_${i}`, this.resolucionFiles[i]!);
    });

    this.docService.cargar_documentos(fd).subscribe({
      next: res => { console.log('OK', res); this.pasoActual = 2; },
      error: err => console.error('Error', err)
    });
  }

  Regresar() {
    this.router.navigate(['/apps/editar-documento']);
  }
}
