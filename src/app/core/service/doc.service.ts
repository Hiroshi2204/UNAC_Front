import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DocService {
  private apiUrl = 'http://127.0.0.1:8000/api/documentos';

  constructor(private http: HttpClient) {}

  subirDocumento(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
