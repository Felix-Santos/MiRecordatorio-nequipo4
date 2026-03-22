import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaTareasPage } from './lista-tareas.page';

const routes: Routes = [
  {
    path: '',
    component: ListaTareasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaTareasPageRoutingModule {}
