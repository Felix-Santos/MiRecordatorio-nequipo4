import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslatePipe]
})
export class CalendarioPage implements OnInit, OnDestroy {
  calendarTasks: { [date: string]: Task[] } = {};
  // use full ISO (start of day) so ion-datetime bindings match picker values
  private startOfTodayIso(): string {
    const d = new Date();
    const s = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    return s;
  }

  selectedDate: string = this.startOfTodayIso();
  minDate: string = this.startOfTodayIso();
  selectedDateTasks: Task[] = [];
  locale: string = 'es-ES';
  private subscription: Subscription = new Subscription();

  constructor(private taskService: TaskService, private settings: SettingsService) {
    this.settings.language$.subscribe(l => {
      this.locale = l === 'en' ? 'en-US' : 'es-ES';
    });
  }

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
    // keep the full ISO string returned by the component to ensure the
    // picker highlights the currently selected columns correctly
    this.selectedDate = event.detail && event.detail.value ? event.detail.value : this.selectedDate;
    this.updateSelectedDateTasks();
  }

  /**
   * Actualiza las tareas para la fecha seleccionada
   */
  private updateSelectedDateTasks(): void {
    const key = this.selectedDate ? this.selectedDate.split('T')[0] : '';
    this.selectedDateTasks = this.calendarTasks[key] || [];
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
    const locale = this.locale || 'es-ES';
    return new Date(dateString).toLocaleDateString(locale, {
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
