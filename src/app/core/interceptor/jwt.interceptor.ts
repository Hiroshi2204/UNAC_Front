import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    //let currentUser = this.authenticationService.currentUserValue;
    const TOKEN = localStorage.getItem('token');
    
    if (TOKEN) {
      console.log('Agregando token:', TOKEN);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
    }

    return next.handle(request);
  }
}
