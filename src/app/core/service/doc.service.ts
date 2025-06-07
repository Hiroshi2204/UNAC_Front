import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DocService {

  //private apiUrl = 'http://127.0.0.1:8000/api/documentos';

  constructor(private http: HttpClient) {}

  /* subirDocumento(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  } */

  subirDoc(data: FormData): Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/api/documentos`, data);
  }

  getTipoDoc(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/documentos/get_id`);
  }


  buscarDoc(q: any, page: any): Observable<any> {
  const params = {...q,page: page};

    return this.http.get<any>(`${environment.apiUrl}/api/documentos/buscar`, { params });}

  eliminarDoc(id:any): Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/api/documentos/eliminar`, { id });

  }

  // doc.service.ts
  descargar_documentos(id: string): Observable<Blob> {
  return this.http.post(`${environment.apiUrl}/api/documentos/descargar`, { id }, {
    responseType: 'blob'
  });
}




}
