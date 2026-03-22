import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ListaTareasPageRoutingModule } from './lista-tareas-routing.module';
import { ListaTareasPage } from './lista-tareas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaTareasPageRoutingModule
  ],
  declarations: [ListaTareasPage] // 👈 AQUÍ VA
})
export class ListaTareasPageModule {}
