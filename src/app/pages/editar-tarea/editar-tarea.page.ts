import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-editar-tarea',
  templateUrl: './editar-tarea.page.html',
  styleUrls: ['./editar-tarea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditarTareaPage implements OnInit {

  tarea: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

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
  }

  saveChanges(): void {
    if (this.tarea) {
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