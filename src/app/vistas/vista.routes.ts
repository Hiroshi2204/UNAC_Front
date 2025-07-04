import { Route } from "@angular/router";
import { VistaResolucionComponent } from "./vista-resolucion/vista-resolucion.component";
import { VistaFacultadesComponent } from "./vista-facultades/vista-facultades.component";
import { LayoutPubComponent } from "./layout-publico/layout-pub/layout-pub.component";


export const VISTA_ROUTE: Route[] = [
  {
    // ⬇️ 1️⃣ Layout contenedor
    path: '',
    component: LayoutPubComponent,

    // ⬇️ 2️⃣ Rutas hijas reales
    children: [
      { path: 'normas_resoluciones', component: VistaResolucionComponent },
      { path: 'facultades',          component: VistaFacultadesComponent },
     

      // (opcional) Landing por defecto
      { path: '', redirectTo: 'normas_resoluciones', pathMatch: 'full' },
    ],
  },
];