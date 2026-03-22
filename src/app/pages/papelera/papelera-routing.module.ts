import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PapeleraPage } from './papelera.page';

const routes: Routes = [
  {
    path: '',
    component: PapeleraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PapeleraPageRoutingModule {}
