import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null') as User | null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

    login(username: string, password: string) {
      return this.http
        .post<any>(`${environment.apiUrl}/api/login`, {
          username,
          password,
        })
        .pipe(
          map((user) => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // console.log(JSON.stringify(user));
            localStorage.setItem('token', user.token);
            localStorage.setItem('currentUser', JSON.stringify(user));
          //ocalStorage.setItem('extraUser', JSON.stringify(user.persona_natural_id));
            
            
            this.currentUserSubject.next(user);
            return user;
          })
      );
  }
  ok(body?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }
  error(message: string) {
    return throwError(message);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
