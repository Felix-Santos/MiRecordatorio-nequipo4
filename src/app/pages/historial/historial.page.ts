import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskHistory } from '../../models/task.model';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { DateFormatterService } from '../../services/date-formatter.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslatePipe]
})
export class HistorialPage implements OnInit, OnDestroy {
  history: TaskHistory[] = [];
  private subscription: Subscription = new Subscription();
  locale: string = 'es-ES';

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private settings: SettingsService,
    private translate: TranslateService,
    private dateFormatter: DateFormatterService
  ) {
    this.settings.language$.subscribe(l => this.locale = l === 'en' ? 'en-US' : 'es-ES');
  }

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
      header: this.translate.translate('HISTORY.CLEAR_CONFIRM_TITLE'),
      message: this.translate.translate('HISTORY.CLEAR_CONFIRM_MESSAGE'),
      buttons: [
        {
          text: this.translate.translate('ALERT.CANCEL'),
          role: 'cancel'
        },
        {
          text: this.translate.translate('BUTTON.CLEAR'),
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
    return this.dateFormatter.formatDateTime(dateString, this.locale);
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
