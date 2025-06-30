import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VistasService {

  //private apiUrl = 'http://127.0.0.1:8000/api/documentos';

  constructor(private http: HttpClient) { }

  getTipoDoc(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/documentos/get_id`);
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

  getOficinas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/vistas/get/oficinas`, {
    });
  }

  getOficinasFacultades(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/vistas/get/oficinas/facultades`, {
    });
  }

  getDocumentosFacultades(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/vistas/get/documentos/facultades`, {
    });
  }

  getDocumentosNormas(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/vistas/get/normas_resoluciones/clase_documentos`, {
    });
  }


  getOficios(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/documentos/get/oficio`);
  }

  getOficios1(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/oficios/get`);
  }

  getDocumentosPorOficio1(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/oficios/get_id?id=${id}`);
  }
  getDocumentosPorOficio(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/oficios/get_id?id=${id}`);
  }

  vistarDocFacultades(nombre: any, numero: any, resumen: any, detalle: any, fecha_doc: any, fecha_inicio: any, fecha_fin: any, ordenCampo: any, ordenDireccion: any, oficina_id: any, page: any): Observable<any> {
    const params = { nombre: nombre, numero: numero, resumen: resumen, detalle: detalle, fecha_doc: fecha_doc, fecha_inicio, fecha_fin, ordenCampo, ordenDireccion, oficina_id: oficina_id, page: page };

    return this.http.get<any>(`${environment.apiUrl}/api/vistas/buscar/documentos/facultades`, { params });
  }

  vistarDocNormas_Resoluciones(nombre: any, numero: any, resumen: any, detalle: any, fecha_doc: any, fecha_inicio: any, fecha_fin: any, ordenCampo: any, ordenDireccion: any, oficina_id: any, clase_documento_id: any, page: any): Observable<any> {
    const params = { nombre: nombre, numero: numero, resumen: resumen, detalle: detalle, fecha_doc: fecha_doc, fecha_inicio, fecha_fin, ordenCampo, ordenDireccion, oficina_id: oficina_id, clase_documento_id: clase_documento_id, page: page };

    return this.http.get<any>(`${environment.apiUrl}/api/vistas/buscar/documentos/normas_resoluciones`, { params });
  }






}
