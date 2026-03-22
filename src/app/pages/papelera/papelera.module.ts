import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PapeleraPageRoutingModule } from './papelera-routing.module';

import { PapeleraPage } from './papelera.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PapeleraPageRoutingModule
  ],
  declarations: [PapeleraPage]
})
export class PapeleraPageModule {}
