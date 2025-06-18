import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { AuthService } from '@core';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FeatherModule,
        RouterLink,
    ]
})
export class SigninComponent implements OnInit {
  loginForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  error = '';
  hide = true;
  loading = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['admin@email.com'],
      password: ['admin@123'],
      
    });
  }

  
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.error = '';
    console.log('Submit triggered');
    this.loading = true;
    //if (this.loginForm.invalid) {
      //this.error = 'Usuario o Contraseña invalido !';
      //return;
    //} else {
    this.authService
        .login(this.f['username'].value, this.f['password'].value)
        .subscribe(
          (res) => {
            this.loading = false;
            if (res && res.token) {
              localStorage.setItem('user', JSON.stringify(res));
              this.router.navigate(['/apps/cargar-documento']);
            } else {
              this.error = 'Usuario o Contraseña Inválida';
            }
            this.submitted = false;
          },
          (error) => {
            this.loading = false;
            this.error = "Usuario o Contraseña Inválida";
            this.submitted = false;
          }
        );
    }
    
}

