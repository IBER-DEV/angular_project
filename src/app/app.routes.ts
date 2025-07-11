import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HallazgosListaComponent } from './components/hallazgos-lista/hallazgos-lista.component';
import { HallazgoFormComponent } from './components/hallazgo-form/hallazgo-form.component';
import { HallazgoDetalleComponent } from './components/hallazgo-detalle/hallazgo-detalle.component';
import { Login } from './components/login/login';

export const routes: Routes = [
  {path: 'login', component: Login},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'hallazgos', component: HallazgosListaComponent },
  { path: 'hallazgos/:id', component: HallazgoDetalleComponent },
  { path: 'nuevo-hallazgo', component: HallazgoFormComponent },
  { 
    path: 'clasificacion', 
    loadComponent: () => import('./components/clasificacion/clasificacion.component').then(m => m.ClasificacionComponent)
  },
  { 
    path: 'analisis-causas', 
    loadComponent: () => import('./components/analisis-causas/analisis-causas.component').then(m => m.AnalisisCausasComponent)
  },
  { 
    path: 'actividades', 
    loadComponent: () => import('./components/actividades/actividades.component').then(m => m.ActividadesComponent)
  },
  { 
    path: 'reportes', 
    loadComponent: () => import('./components/reportes/reportes.component').then(m => m.ReportesComponent)
  },
  { 
    path: 'auditoria', 
    loadComponent: () => import('./components/auditoria/auditoria.component').then(m => m.AuditoriaComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];