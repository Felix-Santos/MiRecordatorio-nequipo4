import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { SettingsService } from '../../services/settings.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-editar-tarea',
  templateUrl: './editar-tarea.page.html',
  styleUrls: ['./editar-tarea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslatePipe]
})
export class EditarTareaPage implements OnInit {

  tarea: Task | undefined;
  notifyAmount: number = 1;
  notifyUnit: 'hours' | 'days' = 'hours';
  // use start of day ISO so time selection works properly
  minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).toISOString(); // Fecha actual como mínimo
  locale: string = 'es-ES'; // default locale

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private settings: SettingsService
  ) {
    this.settings.language$.subscribe(l => this.locale = l === 'en' ? 'en-US' : 'es-ES');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(Number(id))) {
      this.router.navigate(['/lista-tareas']);
      return;
    }
    this.tarea = this.taskService.getTaskById(Number(id));
    if (!this.tarea) {
      this.router.navigate(['/lista-tareas']);
    }

    // Inicializar controles de notificación a partir del valor almacenado
    if (this.tarea && this.tarea.notifyBeforeMinutes) {
      const minutes = this.tarea.notifyBeforeMinutes;
      if (minutes % 1440 === 0) {
        this.notifyUnit = 'days';
        this.notifyAmount = Math.round(minutes / 1440);
      } else {
        this.notifyUnit = 'hours';
        this.notifyAmount = Math.round(minutes / 60);
      }
    }
  }

  saveChanges(): void {
    if (this.tarea) {
      // normalizar fecha antes de guardar
      if (this.tarea.date) {
        this.tarea.date = new Date(this.tarea.date).toISOString();
      }
      // Calcular minutos de anticipación según selección del usuario
      let notifyBeforeMinutes: number | undefined = undefined;
      const amount = Number(this.notifyAmount) || 0;
      if (amount > 0) {
        notifyBeforeMinutes = this.notifyUnit === 'days' ? amount * 24 * 60 : amount * 60;
      }
      this.tarea.notifyBeforeMinutes = notifyBeforeMinutes;

      this.taskService.updateTask(this.tarea.id, this.tarea);
      this.router.navigate(['/lista-tareas']);
    }
  }

  deleteTask(): void {
    if (this.tarea) {
      this.taskService.deleteTask(this.tarea.id);
      this.router.navigate(['/lista-tareas']);
    }
  }
}