import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { DocService } from '@core/service/doc.service';

@Component({
  selector: 'app-subir-documento',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './subir-documento.component.html',
  styleUrl: './subir-documento.component.scss'
})


export class SubirDocumentoComponent {
  documentoForm: FormGroup;
  pdfFile: File | null = null;

  constructor(private fb: FormBuilder, private docService: DocService) {
    this.documentoForm = this.fb.group({
      pdf: [null]
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
    const formData = new FormData();
    formData.append('pdf', this.pdfFile);

    this.docService.subirDocumento(formData).subscribe({
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
