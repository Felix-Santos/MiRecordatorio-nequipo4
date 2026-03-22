import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaTareaPageRoutingModule } from './nueva-tarea-routing.module';

import { NuevaTareaPage } from './nueva-tarea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaTareaPageRoutingModule
  ],
  declarations: [NuevaTareaPage]
})
export class NuevaTareaPageModule {}
