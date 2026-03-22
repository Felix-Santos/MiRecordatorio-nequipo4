import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.page.html',
  styleUrls: ['./lista-tareas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ListaTareasPage {
  tasks = [
  {
    title: "Preparar presentación",
    date: "25 May 2022",
    status: "Pendiente",
    priority: "Alta",
    completed: false
  },
  {
    title: "Comprar víveres",
    date: "23 May 2022",
    status: "Pendiente",
    priority: "Media",
    completed: false
  },
  {
    title: "Enviar informe mensual",
    date: "20 May 2022",
    status: "Completada",
    priority: "Baja",
    completed: true
  }
];
}