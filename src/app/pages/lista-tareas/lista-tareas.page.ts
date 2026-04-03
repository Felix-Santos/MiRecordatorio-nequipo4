import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.page.html',
  styleUrls: ['./lista-tareas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class ListaTareasPage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  selectedSegment: 'all' | 'priority' | 'completed' = 'all';
  private subscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en las tareas según el segmento seleccionado
    this.loadTasksBySegment();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    // Aquí podríamos agregar AuthService.logout() si es necesario
    window.location.href = '/login';
  }

  /**
   * Carga tareas según el segmento seleccionado
   */
  loadTasksBySegment(): void {
    this.subscription.unsubscribe(); // Cancelar suscripción anterior
    this.subscription = this.taskService.getTasksBySegment(this.selectedSegment)
      .subscribe(tasks => {
        this.tasks = tasks;
      });
  }

  /**
   * Maneja el cambio de segmento
   */
  onSegmentChange(event: any): void {
    this.selectedSegment = event.detail.value;
    this.loadTasksBySegment();
  }

  /**
   * Alterna el estado completado de una tarea
   */
  toggleComplete(task: Task): void {
    this.taskService.toggleComplete(task.id);
  }

  /**
   * Elimina una tarea (soft delete) con confirmación
   */
  async deleteTask(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro que deseas eliminar la tarea "${task.title}"?`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // El alert se cierra automáticamente con role: 'cancel'
          }
        },
        {
          text: 'Eliminar',
          role: 'confirm',
          handler: () => {
            this.taskService.deleteTask(task.id);
          }
        }
      ]
    });

    await alert.present();
  }
}