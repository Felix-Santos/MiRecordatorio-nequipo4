import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskHistory } from '../models/task.model';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private history: TaskHistory[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private deletedTasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  public deletedTasks$ = this.deletedTasksSubject.asObservable();

  private readonly TASKS_KEY = 'tasks';
  private readonly HISTORY_KEY = 'taskHistory';

  constructor(private authService: AuthService, private storageService: StorageService) {
    // Suscribirse a cambios de usuario para actualizar la vista de tareas
    this.authService.currentUser$.subscribe(() => this.updateTasksSubject());
    // Inicialización asíncrona: cargar tareas desde StorageService
    this.init();
  }

  private async init(): Promise<void> {
    await this.storageService.ready();
    await this.loadFromStorage();
  }

  /**
   * Carga tareas e historial desde localStorage (simulando base de datos)
   */
  private async loadFromStorage(): Promise<void> {
    const storedTasks = await this.storageService.get<Task[]>(this.TASKS_KEY);
    const storedHistory = await this.storageService.get<TaskHistory[]>(this.HISTORY_KEY);

    if (storedTasks && Array.isArray(storedTasks)) {
      this.tasks = storedTasks;
    } else {
      this.tasks = []; // Sin contenido inicial para mostrar solo lo ingresado
    }

    if (storedHistory && Array.isArray(storedHistory)) {
      this.history = storedHistory;
    }

    this.updateTasksSubject();
  }

  /**
   * Guarda tareas e historial en localStorage
   */
  private async saveToStorage(): Promise<void> {
    try {
      await this.storageService.set(this.TASKS_KEY, this.tasks);
      await this.storageService.set(this.HISTORY_KEY, this.history);
    } catch (e) {
      // si falla el guardado, no interrumpimos la app; en producción loggear/reportar
      console.error('Error guardando tareas en StorageService', e);
    }
  }

  /**
   * Actualiza el BehaviorSubject con las tareas del usuario actual
   */
  private updateTasksSubject(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userTasks = this.tasks.filter(task => task.userId === currentUser.id && !task.deletedAt);
      const deletedTasks = this.tasks.filter(task => task.userId === currentUser.id && task.deletedAt);
      this.tasksSubject.next(userTasks);
      this.deletedTasksSubject.next(deletedTasks);
    } else {
      this.tasksSubject.next([]);
      this.deletedTasksSubject.next([]);
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
            // Ordenar todas las tareas por prioridad: Alta -> Media -> Baja
            filteredTasks = [...tasks].sort((a, b) => {
              const priorityOrder = { 'Alta': 0, 'Media': 1, 'Baja': 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
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
    return this.tasks$.pipe(
      map(tasks => {
        const calendarTasks: { [date: string]: Task[] } = {};
        tasks.forEach(task => {
          const taskDate = new Date(task.date).toISOString().split('T')[0];
          if (!calendarTasks[taskDate]) {
            calendarTasks[taskDate] = [];
          }
          calendarTasks[taskDate].push(task);
        });
        return calendarTasks;
      })
    );
  }

  /**
   * Obtiene tareas eliminadas (papelera)
   */
  getDeletedTasks(): Observable<Task[]> {
    return this.deletedTasks$;
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
      id: this.getNextId(this.tasks),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(newTask);
    this.addToHistory(newTask.id, 'created', null, newTask);
    void this.saveToStorage();
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
      void this.saveToStorage();
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
      void this.saveToStorage();
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
      void this.saveToStorage();
      this.updateTasksSubject();
    }
  }

  /**
   * Elimina permanentemente una tarea
   */
  permanentlyDeleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    void this.saveToStorage();
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
      void this.saveToStorage();
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
      id: this.getNextId(this.history),
      taskId,
      userId: currentUser.id,
      action,
      oldValue,
      newValue,
      timestamp: new Date().toISOString()
    };

    this.history.push(historyEntry);
    void this.saveToStorage();
  }

  /**
   * Genera el siguiente ID para un arreglo basado en sus elementos
   * @param arr    Arreglo donde buscar el máximo ID
   * @param idKey  Clave del ID (ej: 'id')
   */
  private getNextId<T extends { [key: string]: any }>(arr: T[], idKey: string = 'id'): number {
    return arr.length > 0 ? Math.max(...arr.map(item => item[idKey] as number)) + 1 : 1;
  }

  /**
   * Limpia todo el historial del usuario actual
   */
  clearHistory(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.history = this.history.filter(h => h.userId !== currentUser.id);
      void this.saveToStorage();
    }
  }
}