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
    ReactiveFormsModule, CommonModule, FormsModule
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
  nombreArchivo: string = '';
  nombreOficio: string = '';



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
        //fecha_doc: ['', Validators.required],
        resoluciones: this.fb.array([]),
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

  // guardarCambios1() {
  //   if (this.oficioForm.invalid) {
  //     alert('Completa los campos obligatorios');
  //     return;
  //   }



  //   const formData = new FormData();
  //   const datosFormulario = this.oficioForm.value;

  //   // Añadir el ID del oficio
  //   formData.append('id', this.id.toString());

  //   // Oficio
  //   formData.append('numero', datosFormulario.oficio.numero);

  //   if (this.oficioFile) {
  //     formData.append('pdf', this.oficioFile); // solo se manda si hay nuevo archivo
  //   }

  //   // Preparar resoluciones como JSON
  //   const resolucionesJson: any[] = [];

  //   this.resoluciones.controls.forEach((resolucion, index) => {
  //     const valor = resolucion.value;

  //     resolucionesJson.push({
  //       id: valor.id || null,
  //       clase_documento_id: valor.clase_documento_id,
  //       nombre: valor.nombre,
  //       numero: valor.numero,
  //       fecha: valor.fecha,
  //       resumen: valor.resumen,
  //       detalle: valor.detalle,
  //     });

  //     // Adjuntar archivo si existe
  //     if (this.resolucionFiles[index]) {
  //       formData.append(`pdf_documento_${index}`, this.resolucionFiles[index]);
  //     }
  //   });

  //   formData.append('resoluciones', JSON.stringify(resolucionesJson));

  //   // Enviar al backend
  //   this.docService.actualizar_documentos(formData).subscribe({
  //     next: (res) => {
  //       alert('Oficio actualizado correctamente');
  //       this.router.navigate(['/apps/editar-documento']);
  //     },
  //     error: (err) => {
  //       console.error('Error al actualizar el oficio', err);
  //       alert('Error al actualizar el oficio');
  //     }
  //   });
  // }
  guardarCambios() {
    if (this.oficioForm.invalid) {
      alert('Completa los campos obligatorios');
      return;
    }

    const formData = new FormData();
    const datosFormulario = this.oficioForm.value;

    // Oficio
    formData.append('id', this.id.toString());
    formData.append('numero', datosFormulario.oficio.numero);

    // Solo si hay un nuevo archivo
    if (this.oficioFile) {
      formData.append('pdf', this.oficioFile);
    }
    // Filtrar resoluciones válidas (opcional: podrías omitir vacías si deseas que no se envíen)
    const resolucionesValidas = this.resoluciones.controls.filter((resolucion) => {
      const v = resolucion.value;
      return v.clase_documento_id && v.nombre && v.numero;
    });

    // Documentos relacionados (resoluciones)
    // this.resoluciones.controls.forEach((resolucion, index) => {
    //   const valor = resolucion.value;

    //   const datosResolucion = {
    //     id: valor.id || null,
    //     clase_documento_id: valor.clase_documento_id,
    //     nombre: valor.nombre,
    //     numero: valor.numero,
    //     fecha: valor.fecha,
    //     resumen: valor.resumen,
    //     detalle: valor.detalle
    //   };

    //   // Agregar datos JSON de la resolución
    //   formData.append(`datos_documento_${index}`, JSON.stringify(datosResolucion));

    //   // Agregar archivo si existe
    //   if (this.resolucionFiles[index]) {
    //     formData.append(`archivo_documento_${index}`, this.resolucionFiles[index]);
    //   }
    // });
    resolucionesValidas.forEach((resolucion, index) => {
      const valor = resolucion.value;

      const datosResolucion = {
        id: valor.id || null,
        clase_documento_id: valor.clase_documento_id,
        nombre: valor.nombre,
        numero: valor.numero,
        fecha: valor.fecha,
        resumen: valor.resumen,
        detalle: valor.detalle
      };

      formData.append(`datos_documento_${index}`, JSON.stringify(datosResolucion));

      if (this.resolucionFiles[index]) {
        formData.append(`archivo_documento_${index}`, this.resolucionFiles[index]);
      }
    });

    this.docService.actualizar_documentos(formData).subscribe({
      next: (res) => {
        alert('Oficio actualizado correctamente');
        this.router.navigate(['/apps/editar-documento']);
      },
      error: (err) => {
        console.error('Error al actualizar el oficio', err);
        alert('Error al actualizar el oficio');
      }
    });
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

  // cargarOficio(id: number) {
  //   this.docService.getDocumentosPorOficio(id).subscribe({
  //     next: (res: any) => {
  //       const data = res?.oficio;

  //       if (!data) {
  //         console.error('No se encontró data.oficio en la respuesta:', res);
  //         return;
  //       }

  //       // Solo actualiza los valores del formulario sin reemplazarlo completamente
  //       this.oficioForm.patchValue({
  //         oficio: {
  //           numero: data.numero,
  //           //nombreArchivo: data.nombre_original_pdf
  //         }
  //       });
  //       this.nombreArchivo = data.nombre_original_pdf;

  //       this.documentosRelacionados = data.documentos || [];

  //       // Si quieres agregar resoluciones desde backend, hazlo aquí (si existen)
  //       if (data.resoluciones && Array.isArray(data.resoluciones)) {
  //         this.resoluciones.clear(); // limpiar si ya había alguna

  //         data.resoluciones.forEach((resol: any, index: number) => {
  //           const grupo = this.fb.group({
  //             clase_documento_id: [resol.clase_documento_id, Validators.required],
  //             nombre: [resol.nombre, Validators.required],
  //             numero: [resol.numero, Validators.required],
  //             fecha: [resol.fecha, Validators.required],
  //             resumen: [resol.resumen || ''],
  //             detalle: [resol.detalle || ''],
  //           });

  //           this.resoluciones.push(grupo);
  //           this.resolucionFiles.push(null!); // agrega espacio para archivo si deseas
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar oficio', err);
  //       this.router.navigate(['/apps/editar-documento']);
  //     }
  //   });
  // }

  cargarOficio(id: number) {
    this.docService.getDocumentosPorOficio(id).subscribe({
      next: (res: any) => {
        const oficio = res.oficio;

        // Cargar datos del oficio
        this.oficioForm.patchValue({
          numero: oficio.numero,
        });

        // Guardar nombre del Oficio
        this.nombreOficio = oficio.numero;

        // Guardar nombre del archivo
        this.nombreArchivo = oficio.nombre_original_pdf;

        // Limpiar resoluciones existentes
        this.resoluciones.clear();

        // Llenar resoluciones que llegan del API
        oficio.documentos.forEach((doc: any) => {
          const grupo = this.fb.group({
            id: [doc.id || null], // aquí capturamos el ID de la resolución
            clase_documento_id: [doc.clase_documento_id || '', Validators.required],
            nombre: [doc.nombre || '', Validators.required],
            numero: [doc.numero || '', Validators.required],
            fecha: [doc.fecha_doc || '', Validators.required],
            resumen: [doc.resumen || '', Validators.required],
            detalle: [doc.detalle || '', Validators.required],
            nombre_original_pdf: [doc.nombre_original_pdf || '', Validators.required],
          });

          this.resoluciones.push(grupo);
          this.resolucionFiles.push(); // o usar doc.pdf_path si vas a mostrar el nombre original
        });
      },
      error: (err) => {
        console.error('Error al cargar el oficio', err);
      }
    });
  }

  regresar() {
    this.router.navigate(['/apps/editar-documento']);
  }

  // get resoluciones(): FormArray<FormGroup> {
  //   return this.oficioForm.get('resoluciones') as FormArray<FormGroup>;

  // }
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

  // agregarResolucion(): void {
  //   const resolucionForm = this.fb.group({
  //     clase_documento_id: ['', Validators.required],
  //     nombre: ['', Validators.required],
  //     numero: ['', Validators.required],
  //     fecha: ['', Validators.required],
  //     resumen: [''],
  //     detalle: [''],
  //   });

  //   // Añadimos la nueva resolución
  //   this.resoluciones.push(resolucionForm);
  //   this.resolucionFiles.push(null!);
  //   this.activeTab = this.resoluciones.length - 1;

  //   // Ahora suscribimos el cambio en el campo 'numero' de esta nueva resolución
  //   resolucionForm.get('numero')?.valueChanges.subscribe(valor => {
  //     if (valor) {  // Comprobamos si 'valor' no es null o undefined
  //       this.buscarCoincidencias(valor, `resolucion-${this.resoluciones.length - 1}`);
  //     }
  //   });

  //   // Suscribimos también a cambios en 'clase_documento_id' si es necesario
  //   resolucionForm.get('clase_documento_id')?.valueChanges.subscribe(valor => {
  //     this.filtrar_documentos_existentes(valor);
  //   });
  // }

  agregarResolucion() {
    const grupo = this.fb.group({
      clase_documento_id: ['', Validators.required],
      nombre: ['', Validators.required],
      numero: ['', Validators.required],
      fecha: ['', Validators.required],
      resumen: ['', Validators.required],
      detalle: ['', Validators.required],
    });

    this.resoluciones.push(grupo);
    this.resolucionFiles.push();
    this.activeTab = this.resoluciones.length - 1;

    grupo.get('numero')?.valueChanges.subscribe(valor => {
      if (valor) {  // Comprobamos si 'valor' no es null o undefined
        this.buscarCoincidencias(valor, `resolucion-${this.resoluciones.length - 1}`);
      }
    });

    grupo.get('clase_documento_id')?.valueChanges.subscribe(valor => {
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

  // onResolucionFileChange(event: Event, index: number): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   if (fileInput.files?.length) {
  //     this.resolucionFiles[index] = fileInput.files[0];
  //   }
  // }

  onResolucionFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.resolucionFiles[index] = file;
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

  trackByIndex(index: number, obj: any): any {
    return index;
  }




}

