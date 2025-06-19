import { Route } from "@angular/router";
import { ChatComponent } from "./chat/chat.component";
import { ContactGridComponent } from "./contact-grid/contact-grid.component";
import { BlogComponent } from "./blog/blog.component";
import { SubirDocumentoComponent } from "./subir-documento/subir-documento.component";
import { BuscarDocumentoComponent } from "./buscar-documento/buscar-documento.component";
import { DocumentoComponent } from "./documento/documento.component";
import { EditarDocumentoComponent } from "./editar-documento/editar-documento.component";
import { EditarOficioComponent } from "./editar-oficio/editar-oficio.component";
import { PendientesComponent } from "./publicar/pendientes/pendientes.component";
import { PublicadosComponent } from "./publicar/publicados/publicados.component";
import { MenuPrincipalComponent } from "./menu-principal/menu-principal.component";
import { GeneralComponent } from "./reportes/general/general.component";
import { EspecificoComponent } from "./reportes/especifico/especifico.component";
import { ContraloriaComponent } from "./reportes/contraloria/contraloria.component";

export const APPS_ROUTE: Route[] = [
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'contact-grid',
    component: ContactGridComponent,
  },
  {
    path: 'menu-principal',
    component: MenuPrincipalComponent,
  },
  {
    path: 'subir-documento',
    component: SubirDocumentoComponent,
  },
  {
    path: 'buscar-documento',
    component: BuscarDocumentoComponent,
  },
  {
    path: 'cargar-documento',
    component: DocumentoComponent,
  },
  {
    path: 'editar-documento',
    component: EditarDocumentoComponent,
  },
  {
    path: 'editar-oficio',
    component: EditarOficioComponent,
  },
  {
    path: 'publicar',
    children: [
      {
        path: 'pendientes',
        component: PendientesComponent
      },
      {
        path: 'publicados',
        component: PublicadosComponent
      },
      {
        path: '',
        redirectTo: 'pendientes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'reportes',
    children: [
      {
        path: 'general',
        component: GeneralComponent
      },
      {
        path: 'especificos',
        component: EspecificoComponent
      },
      {
        path: 'contraloria',
        component: ContraloriaComponent
      },
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      }
    ]
  }


];
