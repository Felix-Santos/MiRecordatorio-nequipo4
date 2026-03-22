import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaTareaPage } from './nueva-tarea.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaTareaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaTareaPageRoutingModule {}
