  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
  import { DocService } from '@core/service/doc.service';
  import { CommonModule } from '@angular/common';

  @Component({
    selector: 'app-subir-documento',
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './subir-documento.component.html',
    styleUrl: './subir-documento.component.scss'
  })


  export class SubirDocumentoComponent implements OnInit {
    tiposDocumento: any[] = [];
    documentoForm: FormGroup;
    pdfFile: File | null = null;
    documentos_existentes: any[] = [];

    constructor(private fb: FormBuilder, private docService: DocService) {


      this.documentoForm = this.fb.group({
        nombre: ['', Validators.required],
        numero: ['', Validators.required],
        //anio: ['', Validators.required],
        clase_documento_id: ['', Validators.required],
        fecha_doc: ['', Validators.required],
        asunto: ['', Validators.required],
        resumen: [''], // opcional
      });
    }

    ngOnInit(): void {
      //this.documentoForm.get('numero')?.disable();

      this.cargarTiposDocumento();
      this.documentoForm.get('clase_documento_id')?.valueChanges.subscribe(id => {
        if (id) {
          this.filtrar_documentos_existentes(id);
        }
      });

      this.documentoForm.get('numero')?.valueChanges.subscribe(valor => {
    this.buscarCoincidencias(valor);
  });
      

      
    }

  numeroExistenteMensaje: string = '';

  buscarCoincidencias(valor: string) {
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
    this.numeroExistenteMensaje = `Ya existe un documento con el número ${numeroIngresado} ( ${coincidenciasTexto})`;
  } else {
    this.numeroExistenteMensaje = '';
  }
}


    filtrar_documentos_existentes(id:any){
      this.docService.getResolucionesPorOficina(id).subscribe({
        next: (res) => {
          
          this.documentos_existentes = res.documentos
          console.log(this.documentos_existentes)
          console.log("hola")

        },
        error: (err)=> {
          console.log(err)
        }
      })
    }

    cargarTiposDocumento() {
    this.docService.getTipoDoc().subscribe({
      next: (res) => {
        console.log('Respuesta de API:', res); // Confirmar formato
        this.tiposDocumento = res.documentos;  // 👈 Usa el array correcto
        console.log(this.tiposDocumento)
      },
      error: (err) => {
        console.error('Error cargando tipos de documento', err);
        alert('Error al cargar tipos de documento');
      }
    });
  }

  

    onFileChange(event: any) {
      if (event.target.files && event.target.files.length > 0) {
        this.pdfFile = event.target.files[0];
      }
    }


    

    onSubmit() {
      if (!this.pdfFile) {
        alert('Debes seleccionar un archivo PDF.');
        return;
      }

      const formValues = this.documentoForm.value;
      const formData = new FormData();

      // Agregar todos los campos del formulario
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          const value = formValues[key];
          if (key === 'resumen' && !value) {
            continue; // omitir si está vacío
          }
          formData.append(key, value);
        }
      }

      // Agregar el archivo
      formData.append('pdf', this.pdfFile);

      this.docService.subirDoc(formData).subscribe({
        next: res => {
          alert('Documento subido correctamente');
          this.documentoForm.reset();
          this.pdfFile = null;
        },
        error: err => {
        
          console.error('ERROR COMPLETO:', err);
          console.log('Código de error HTTP:', err.status); // <-- VERIFICAR

          let mensaje = 'Nombre de archivo ya existente';

          if (err.status === 409) {
            mensaje = 'Nombre de archivo ya existente';
          }

          alert(mensaje);

      }
      });
    }

  } 

