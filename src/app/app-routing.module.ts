import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'lista-tareas',
    loadComponent: () => import('./pages/lista-tareas/lista-tareas.page').then(m => m.ListaTareasPage)
  },
  {
    path: 'nueva-tarea',
    loadComponent: () => import('./pages/nueva-tarea/nueva-tarea.page').then(m => m.NuevaTareaPage)
  },
  {
    path: 'editar-tarea/:id',
    loadComponent: () => import('./pages/editar-tarea/editar-tarea.page').then(m => m.EditarTareaPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then(m => m.HistorialPage)
  },
  {
    path: 'papelera',
    loadComponent: () => import('./pages/papelera/papelera.page').then(m => m.PapeleraPage)
  },
  {
    path: 'calendario',
    loadComponent: () => import('./pages/calendario/calendario.page').then(m => m.CalendarioPage)
  }
  ,
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}