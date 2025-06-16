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


  buscarDoc( nombre : any, numero:any, resumen:any, detalle:any, fecha_doc:any, oficina_id:any, page: any): Observable<any> {
  const params = { nombre:nombre, numero:numero,resumen:resumen,detalle:detalle,fecha_doc:fecha_doc,oficina_id:oficina_id, page: page};

    return this.http.get<any>(`${environment.apiUrl}/api/documentos/buscar/busqueda_documentos_parametros`, { params });}


  eliminarDoc(id:any): Observable<any> { 
    return this.http.post<any>(`${environment.apiUrl}/api/documentos/eliminar`, {id});

  }

  // doc.service.ts
  descargar_documentos(id: string): Observable<Blob> {
  return this.http.post(`${environment.apiUrl}/api/documentos/descargar`, { id }, {
    responseType: 'blob'
  });
}

 getResolucionesPorOficina(clase_documento_id: any): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/api/documentos/get/documentos`, {
    params: { clase_documento_id: clase_documento_id }
  });
}

getOficinas(oficina_id:any): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/api/documentos/get_oficinas`, {
    params: { oficina_id: oficina_id }
  });
}

cargar_documentos(data:FormData): Observable<any>{
  return this.http.post<any>(`${environment.apiUrl}/api/documentos/creacion_oficios_documentos`, data);
  }


getOficios(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/api/documentos/get/oficio`);
}

getOficios1(): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl}/api/oficios/get`);
}

// getDocumentosPorOficio(id:any): Observable<any> {
//     return this.http.post<any>(`${environment.apiUrl}/api/oficios/get_id`, {id});

  //}
  getDocumentosPorOficio1(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/oficios/get_id?id=${id}`);
  }
  getDocumentosPorOficio(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/oficios/get_id?id=${id}`);
  }






}
