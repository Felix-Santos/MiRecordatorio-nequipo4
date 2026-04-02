import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-papelera',
  templateUrl: './papelera.page.html',
  styleUrls: ['./papelera.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class PapeleraPage implements OnInit, OnDestroy {
  deletedTasks: Task[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) {}

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
   * Elimina permanentemente una tarea con confirmación
   */
  async permanentlyDeleteTask(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar definitivamente',
      message: `¿Seguro que deseas eliminar la tarea "${task.title}" de forma permanente?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.taskService.permanentlyDeleteTask(task.id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Formatea la fecha de eliminación
   */
  formatDeletedDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
