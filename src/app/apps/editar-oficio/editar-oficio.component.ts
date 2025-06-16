import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocService } from '@core/service/doc.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-oficio',
  templateUrl: './editar-oficio.component.html',
  styleUrls: ['./editar-oficio.component.scss'],
  imports: [
    ReactiveFormsModule,CommonModule, FormsModule
    // otros módulos
  ]
})
export class EditarOficioComponent implements OnInit {
  oficioForm!: FormGroup;
  oficio: any;
  id!: number;
  documentosRelacionados: any[] = [];
  oficioFile: File | null = null;
  fechaHoy: string = '';
  resolucionFiles: File[] = [];
  activeTab: number = 0;
  pasoActual: number = 1;
  documentos_existentes: any[] = [];
  numeroExistenteMensaje: string = '';
  numeroExistenteMensajeOficio: string = '';
  tiposDocumento: any[] = [];
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private docService: DocService
  ) { }

  ngOnInit(): void {

    this.oficioForm = this.fb.group({
      oficio: this.fb.group({
        numero: ['', Validators.required],
        fecha_doc: ['', Validators.required],
      }),
      resoluciones: this.fb.array([]),
    });
    this.cargarTiposDocumento();

    this.fechaHoy = this.formatearFecha(new Date());

    this.agregarResolucion();

    const data = history.state.oficio;
    if (data) {
    // solo accede si existe
      this.documentosRelacionados = data.documentos || [];
    }
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {
        this.cargarOficio(this.id);
      } else {
        this.router.navigate(['/apps/editar-documento']);
      }
    });

    // this.oficioForm = this.fb.group({
    //   numero: [data.numero],
    // });

    // Asignamos los documentos relacionados


    // this.documentosRelacionados = data.documentos || [];
  }

  formatearFecha(fecha: Date): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    return `${dia} de ${mes} ${anio}`;
  }

  onFileChange(e: Event) {
    const f = (e.target as HTMLInputElement).files;
    if (f?.length) this.oficioFile = f[0];
  }

  guardarCambios() {
    if (this.oficioForm.invalid) return alert('Completa los campos obligatorios');
    const data = this.oficioForm.value;
    console.log('Guardar oficio actualizado:', data, 'Archivo:', this.oficioFile);
  }

  get numeroOficio(): string {
    return this.oficioForm?.get('numero')?.value || '';
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

  cargarOficio(id: number) {
    this.docService.getDocumentosPorOficio(id).subscribe({
      next: (res: any) => {
        const data = res?.oficio;

        if (!data) {
          console.error('No se encontró data.oficio en la respuesta:', res);
          return;
        }

        // Solo actualiza los valores del formulario sin reemplazarlo completamente
        this.oficioForm.patchValue({
          oficio: {
            numero: data.numero,
            fecha_doc: data.fecha_doc
          }
        });

        this.documentosRelacionados = data.documentos || [];

        // Si quieres agregar resoluciones desde backend, hazlo aquí (si existen)
        if (data.resoluciones && Array.isArray(data.resoluciones)) {
          this.resoluciones.clear(); // limpiar si ya había alguna

          data.resoluciones.forEach((resol: any, index: number) => {
            const grupo = this.fb.group({
              clase_documento_id: [resol.clase_documento_id, Validators.required],
              nombre: [resol.nombre, Validators.required],
              numero: [resol.numero, Validators.required],
              fecha: [resol.fecha, Validators.required],
              resumen: [resol.resumen || ''],
              detalle: [resol.detalle || ''],
            });

            this.resoluciones.push(grupo);
            this.resolucionFiles.push(null!); // agrega espacio para archivo si deseas
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar oficio', err);
        this.router.navigate(['/apps/editar-documento']);
      }
    });
  }

  regresar() {
    this.router.navigate(['/apps/editar-documento']);
  }

  get resoluciones(): FormArray<FormGroup> {
    return this.oficioForm.get('resoluciones') as FormArray<FormGroup>;

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

  agregarResolucion(): void {
    const resolucionForm = this.fb.group({
      clase_documento_id: ['', Validators.required],
      nombre: ['', Validators.required],
      numero: ['', Validators.required],
      fecha: ['', Validators.required],
      resumen: [''],
      detalle: [''],
    });

    // Añadimos la nueva resolución
    this.resoluciones.push(resolucionForm);
    this.resolucionFiles.push(null!);
    this.activeTab = this.resoluciones.length - 1;

    // Ahora suscribimos el cambio en el campo 'numero' de esta nueva resolución
    resolucionForm.get('numero')?.valueChanges.subscribe(valor => {
  if (valor) {  // Comprobamos si 'valor' no es null o undefined
    this.buscarCoincidencias(valor, `resolucion-${this.resoluciones.length - 1}`);
  }
});

    // Suscribimos también a cambios en 'clase_documento_id' si es necesario
    resolucionForm.get('clase_documento_id')?.valueChanges.subscribe(valor => {
      this.filtrar_documentos_existentes(valor);
    });
  }

  eliminarResolucion(index: number): void {
    this.resoluciones.removeAt(index);
    this.resolucionFiles.splice(index, 1);
    this.activeTab = 0;
  }

  buscarCoincidencias(valor: string, tipo: string) {
    if (!valor) {
      this.numeroExistenteMensaje = '';
      return;
    }

    const numeroIngresado = valor.replace(/^0+/, '');

    const coincidencias = this.documentos_existentes.filter(doc => {
      const numeroDoc = doc.num_anio?.split('-')[0]?.replace(/^0+/, '');
      return numeroDoc === numeroIngresado;
    });

    if (coincidencias.length > 0) {
      const coincidenciasTexto = coincidencias.map(c => c.num_anio).join(', ');
      this.numeroExistenteMensaje = `Ya existe un oficio con el número ${numeroIngresado} (${coincidenciasTexto})`;
    } else {
      this.numeroExistenteMensaje = '';
    }
  }

  onResolucionFileChange(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.resolucionFiles[index] = fileInput.files[0];
    }
  }

  prueba_imprimir() {
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
      formData.append(`pdf_documento_${index}`, JSON.stringify(documentoJSON));
    });

    // Verificar el contenido de FormData en consola
    formData.forEach((value, key) => {
      //console.log(${key}:, value);
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
  

  

}

