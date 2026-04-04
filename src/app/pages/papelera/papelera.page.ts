import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-papelera',
  templateUrl: './papelera.page.html',
  styleUrls: ['./papelera.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslatePipe]
})
export class PapeleraPage implements OnInit, OnDestroy {
  deletedTasks: Task[] = [];
  private subscription: Subscription = new Subscription();
  locale: string = 'es-ES';

  constructor(private taskService: TaskService, private settings: SettingsService) {
    this.settings.language$.subscribe(l => this.locale = l === 'en' ? 'en-US' : 'es-ES');
  }

  ngOnInit(): void {
    // Cargar tareas eliminadas del usuario
    this.subscription = this.taskService.getDeletedTasks().subscribe(tasks => {
      this.deletedTasks = tasks;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Restaura una tarea eliminada
   */
  restoreTask(task: Task): void {
    this.taskService.restoreTask(task.id);
  }

  /**
   * Elimina permanentemente una tarea
   */
  permanentlyDeleteTask(task: Task): void {
    this.taskService.permanentlyDeleteTask(task.id);
  }

  /**
   * Formatea la fecha de eliminación
   */
  formatDeletedDate(dateString: string): string {
    return new Date(dateString).toLocaleString(this.locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
