import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-nueva-tarea',
  templateUrl: './nueva-tarea.page.html',
  styleUrls: ['./nueva-tarea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NuevaTareaPage {
  newTask = {
    title: '',
    description: '',
    date: '',
    priority: 'Baja' as 'Alta' | 'Media' | 'Baja' // Cambiar default a 'Baja'
  };

  minDate = new Date().toISOString().split('T')[0]; // Fecha actual como mínimo

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  saveTask(): void {
    if (this.newTask.title.trim() && this.newTask.date) {
      this.taskService.addTask({
        ...this.newTask,
        status: 'Pendiente',
        completed: false
      });
      this.showToast('Tarea guardada exitosamente', 'success');
      this.router.navigate(['/lista-tareas']);
    } else {
      this.showToast('Por favor complete título y fecha', 'danger');
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

  voiceInput(): void {
    // Placeholder for voice input functionality
    alert('Funcionalidad de entrada por voz próximamente disponible');
  }
}
