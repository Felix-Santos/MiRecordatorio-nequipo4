import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskHistory } from '../../models/task.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HistorialPage implements OnInit, OnDestroy {
  history: TaskHistory[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit(): void {
    // Cargar historial de acciones del usuario
    this.subscription = this.taskService.getHistory().subscribe(history => {
      this.history = history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Limpia todo el historial con confirmación
   */
  async clearHistory(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Limpiar historial',
      message: '¿Estás seguro que deseas eliminar todo el historial? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Limpiar',
          role: 'confirm',
          handler: () => {
            this.taskService.clearHistory();
            this.history = [];
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Obtiene el nombre descriptivo de la acción
   */
  getActionDescription(action: TaskHistory['action']): string {
    const actions = {
      'created': 'Creada',
      'updated': 'Actualizada',
      'completed': 'Completada',
      'deleted': 'Eliminada',
      'restored': 'Restaurada'
    };
    return actions[action] || action;
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene el color para la acción
   */
  getActionColor(action: TaskHistory['action']): string {
    const colors = {
      'created': 'success',
      'updated': 'primary',
      'completed': 'secondary',
      'deleted': 'danger',
      'restored': 'warning'
    };
    return colors[action] || 'medium';
  }
}
