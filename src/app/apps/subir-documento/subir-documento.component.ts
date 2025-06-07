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

  constructor(private fb: FormBuilder, private docService: DocService) {


    this.documentoForm = this.fb.group({
      nombre: ['', Validators.required],
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      clase_documento_id: ['', Validators.required],
      fecha_doc: ['', Validators.required],
      asunto: ['', Validators.required],
      resumen: [''], // opcional
    });
  }

   ngOnInit(): void {
    this.cargarTiposDocumento();
  }

  cargarTiposDocumento() {
  this.docService.getTipoDoc().subscribe({
    next: (res) => {
      console.log('Respuesta de API:', res);
      this.tiposDocumento = res.documentos;
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
        console.error(err);
        alert('Error al subir documento');
      }
    });
  }
}
