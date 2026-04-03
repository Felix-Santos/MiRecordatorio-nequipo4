import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CalendarioPage implements OnInit, OnDestroy {
  calendarTasks: { [date: string]: Task[] } = {};
  selectedDate: string = new Date().toISOString().split('T')[0];
  minDate: string = new Date().toISOString().split('T')[0];
  selectedDateTasks: Task[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Cargar tareas organizadas por fecha
    this.subscription = this.taskService.getTasksForCalendar().subscribe(tasks => {
      this.calendarTasks = tasks;
      this.updateSelectedDateTasks();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Maneja el cambio de fecha seleccionada
   */
  onDateChange(event: any): void {
    this.selectedDate = event.detail.value.split('T')[0];
    this.updateSelectedDateTasks();
  }

  /**
   * Actualiza las tareas para la fecha seleccionada
   */
  private updateSelectedDateTasks(): void {
    this.selectedDateTasks = this.calendarTasks[this.selectedDate] || [];
  }

  /**
   * Obtiene las tareas para una fecha específica
   */
  getTasksByDate(date: string): Task[] {
    return this.calendarTasks[date] || [];
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Alterna el estado completado de una tarea
   */
  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task.id);
  }
}
