import { Route } from "@angular/router";
import { VistaResolucionComponent } from "./vista-resolucion/vista-resolucion.component";
import { VistaFacultadesComponent } from "./vista-facultades/vista-facultades.component";

export const VISTA_ROUTE: Route[] = [
  {
    path: 'normas_resoluciones',
    component: VistaResolucionComponent,
  },
  {
    path: 'facultades',
    component: VistaFacultadesComponent,
  }


];
