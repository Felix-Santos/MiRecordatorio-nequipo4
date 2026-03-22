import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CalendarioPage {
  tasks = [
  {
    title: "Preparar presentación",
    date: "2022-05-25",
    priority: "Alta"
  },
  {
    title: "Ir al gimnasio",
    date: "2022-05-25",
    priority: "Baja"
  }
];
selectedDate: string = new Date().toISOString().split('T')[0];

onDateChange(event: any) {
  this.selectedDate = event.detail.value.split('T')[0];
}
getTasksByDate() {
  return this.tasks.filter(task => task.date === this.selectedDate);
}
}
