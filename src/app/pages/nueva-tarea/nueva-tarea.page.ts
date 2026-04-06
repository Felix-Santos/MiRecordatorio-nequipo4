import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '../../services/translate.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-nueva-tarea',
  templateUrl: './nueva-tarea.page.html',
  styleUrls: ['./nueva-tarea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslatePipe]
})
export class NuevaTareaPage {
  newTask = {
    title: '',
    description: '',
    date: '',
    priority: 'Baja' as 'Alta' | 'Media' | 'Baja', // Cambiar default a 'Baja'
    // Preferencia de notificación: cantidad y unidad (horas/días)
    notifyAmount: 1,
    notifyUnit: 'hours' as 'hours' | 'days'
  };

  // Opciones de selección: de 1.0 a 10.0 con paso 0.1
  notifyOptions: number[] = Array.from({ length: 91 }, (_, i) => parseFloat((1 + i * 0.1).toFixed(1)));

  // use start of day ISO so users can pick any hour of today
  minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString();
  locale: string = 'es-ES';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastCtrl: ToastController,
    private settings: SettingsService,
    private translate: TranslateService
  ) {
    this.settings.language$.subscribe(l => this.locale = l === 'en' ? 'en-US' : 'es-ES');
  }

  saveTask(): void {
    if (this.newTask.title.trim() && this.newTask.date) {
      // normalizar la fecha a ISO para evitar errores de parsing/locale
      const normalizedDate = new Date(this.newTask.date).toISOString();

      // calcular minutos de anticipación según la preferencia del usuario
      let notifyBeforeMinutes: number | undefined = undefined;
      if (this.newTask.notifyAmount && this.newTask.notifyUnit) {
        const amount = parseFloat(String(this.newTask.notifyAmount)) || 0;
        notifyBeforeMinutes = Math.round(this.newTask.notifyUnit === 'days' ? amount * 24 * 60 : amount * 60);
      }

      this.taskService.addTask({
        ...this.newTask,
        date: normalizedDate,
        status: 'Pendiente',
        completed: false,
        notifyBeforeMinutes
      });
      this.showToast(this.translate.translate('NEW.TOAST_SAVED'), 'success');
      this.router.navigate(['/lista-tareas']);
    } else {
      this.showToast(this.translate.translate('NEW.TOAST_FILL'), 'danger');
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

}
