import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarTareaPageRoutingModule } from './editar-tarea-routing.module';

import { EditarTareaPage } from './editar-tarea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarTareaPageRoutingModule
  ],
  declarations: [EditarTareaPage]
})
export class EditarTareaPageModule {}
