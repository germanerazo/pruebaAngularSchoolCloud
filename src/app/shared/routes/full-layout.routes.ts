import { Routes, RouterModule } from '@angular/router';
import {CorporativosComponent} from '../../pages/full-pages/corporativos/corporativos.component';
import {CorporativosDetalleComponent} from '../../pages/full-pages/corporativos-detalle/corporativos-detalle.component';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'corporativos',
    component: CorporativosComponent,
    data: {
      title: 'Corporativos'
    }
  },
  {
    path: 'corporativos/detalle/:id',
    component: CorporativosDetalleComponent
  }
];
