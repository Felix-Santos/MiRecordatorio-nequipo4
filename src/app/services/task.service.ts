import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskHistory } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private history: TaskHistory[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  private readonly TASKS_KEY = 'tasks';
  private readonly HISTORY_KEY = 'taskHistory';

  constructor(private authService: AuthService) {
    this.loadFromStorage();
  }

  /**
   * Carga tareas e historial desde localStorage (simulando base de datos)
   */
  private loadFromStorage(): void {
    const storedTasks = localStorage.getItem(this.TASKS_KEY);
    const storedHistory = localStorage.getItem(this.HISTORY_KEY);

    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    } else {
      this.tasks = []; // Sin contenido inicial para mostrar solo lo ingresado
    }

    if (storedHistory) {
      this.history = JSON.parse(storedHistory);
    }

    this.updateTasksSubject();
  }

  /**
   * Guarda tareas e historial en localStorage
   */
  private saveToStorage(): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(this.tasks));
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history));
  }

  /**
   * Actualiza el BehaviorSubject con las tareas del usuario actual
   */
  private updateTasksSubject(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userTasks = this.tasks.filter(task => task.userId === currentUser.id && !task.deletedAt);
      this.tasksSubject.next(userTasks);
    } else {
      this.tasksSubject.next([]);
    }
  }

  /**
   * Obtiene todas las tareas del usuario actual
   */
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  /**
   * Obtiene tareas filtradas por segmento
   */
  getTasksBySegment(segment: 'all' | 'priority' | 'completed'): Observable<Task[]> {
    return new Observable(observer => {
      this.tasks$.subscribe(tasks => {
        let filteredTasks = tasks;
        switch (segment) {
          case 'priority':
            filteredTasks = tasks.filter(task => task.priority === 'Alta');
            break;
          case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
          default:
            filteredTasks = tasks;
        }
        observer.next(filteredTasks);
      });
    });
  }

  /**
   * Obtiene tareas para calendario (por fecha)
   */
  getTasksForCalendar(): Observable<{ [date: string]: Task[] }> {
    return new Observable(observer => {
      this.tasks$.subscribe(tasks => {
        const calendarTasks: { [date: string]: Task[] } = {};
        tasks.forEach(task => {
          if (!calendarTasks[task.date]) {
            calendarTasks[task.date] = [];
          }
          calendarTasks[task.date].push(task);
        });
        observer.next(calendarTasks);
      });
    });
  }

  /**
   * Obtiene tareas eliminadas (papelera)
   */
  getDeletedTasks(): Observable<Task[]> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const deletedTasks = this.tasks.filter(task =>
          task.userId === currentUser.id && task.deletedAt
        );
        observer.next(deletedTasks);
      } else {
        observer.next([]);
      }
    });
  }

  /**
   * Obtiene historial de acciones
   */
  getHistory(): Observable<TaskHistory[]> {
    return new Observable(observer => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const userHistory = this.history.filter(h => h.userId === currentUser.id);
        observer.next(userHistory);
      } else {
        observer.next([]);
      }
    });
  }

  /**
   * Obtiene tarea por ID
   */
  getTaskById(id: number): Task | undefined {
    const currentUser = this.authService.getCurrentUser();
    return this.tasks.find(task => task.id === id && task.userId === currentUser?.id);
  }

  /**
   * Agrega una nueva tarea
   */
  addTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const newTask: Task = {
      ...taskData,
      id: this.getNextId(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(newTask);
    this.addToHistory(newTask.id, 'created', null, newTask);
    this.saveToStorage();
    this.updateTasksSubject();
  }

  /**
   * Actualiza una tarea existente
   */
  updateTask(id: number, updates: Partial<Task>): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      const oldTask = { ...this.tasks[index] };
      this.tasks[index] = { ...this.tasks[index], ...updates, updatedAt: new Date().toISOString() };
      this.addToHistory(id, 'updated', oldTask, this.tasks[index]);
      this.saveToStorage();
      this.updateTasksSubject();
    }
  }

  /**
   * Elimina una tarea (soft delete para papelera)
   */
  deleteTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      const oldTask = { ...task };
      task.deletedAt = new Date().toISOString();
      this.addToHistory(id, 'deleted', oldTask, task);
      this.saveToStorage();
      this.updateTasksSubject();
    }
  }

  /**
   * Restaura una tarea desde la papelera
   */
  restoreTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      const oldTask = { ...task };
      delete task.deletedAt;
      task.updatedAt = new Date().toISOString();
      this.addToHistory(id, 'restored', oldTask, task);
      this.saveToStorage();
      this.updateTasksSubject();
    }
  }

  /**
   * Elimina permanentemente una tarea
   */
  permanentlyDeleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToStorage();
    this.updateTasksSubject();
  }

  /**
   * Alterna el estado completado de una tarea
   */
  toggleComplete(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      const oldTask = { ...task };
      const newCompleted = !task.completed;
      task.completed = newCompleted;
      task.status = newCompleted ? 'Completada' : 'Pendiente';
      task.updatedAt = new Date().toISOString();
      this.addToHistory(id, newCompleted ? 'completed' : 'updated', oldTask, task);
      this.saveToStorage();
      this.updateTasksSubject();
    }
  }

  /**
   * Agrega una entrada al historial
   */
  private addToHistory(taskId: number, action: TaskHistory['action'], oldValue: any, newValue: any): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const historyEntry: TaskHistory = {
      id: this.getNextHistoryId(),
      taskId,
      userId: currentUser.id,
      action,
      oldValue,
      newValue,
      timestamp: new Date().toISOString()
    };

    this.history.push(historyEntry);
    this.saveToStorage();
  }

  /**
   * Genera el siguiente ID para tareas
   */
  private getNextId(): number {
    return this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
  }

  /**
   * Genera el siguiente ID para historial
   */
  private getNextHistoryId(): number {
    return this.history.length > 0 ? Math.max(...this.history.map(h => h.id)) + 1 : 1;
  }

  /**
   * Limpia todo el historial del usuario actual
   */
  clearHistory(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.history = this.history.filter(h => h.userId !== currentUser.id);
      this.saveToStorage();
    }
  }
}