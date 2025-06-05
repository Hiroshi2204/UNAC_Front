import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-buscar-documento',
  imports: [
    RouterLink,
        FormsModule,
        ReactiveFormsModule,
  ],
  templateUrl: './buscar-documento.component.html',
  styleUrl: './buscar-documento.component.scss'
})
export class BuscarDocumentoComponent {

  register!: UntypedFormGroup;
  hide = true;
  constructor(private fb: UntypedFormBuilder) {
    this.initForm();
  }
  initForm() {
    this.register = this.fb.group({
      first: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      last: [''],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      address: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      termcondition: [false, [Validators.requiredTrue]],
    });
  }

  onRegister() {
    console.log('Form Value', this.register.value);
  }

}
