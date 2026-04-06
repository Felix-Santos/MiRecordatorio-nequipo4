import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskHistory } from '../models/task.model';
import { AuthService } from './auth.service';
import { ToastController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics } from '@capacitor/haptics';

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

  constructor(
    private authService: AuthService,
    private toastCtrl: ToastController,
    private platform: Platform
  ) {
    this.loadFromStorage();
    this.initNotifications();
  }

  /** Inicializa listeners y permisos para notificaciones locales */
  private async initNotifications(): Promise<void> {
    try {
      await this.ensureNotificationPermissions();

      // Cuando llega una notificación mientras la app está en primer plano
      LocalNotifications.addListener('localNotificationReceived', (notification: any) => {
        const payload = notification?.notification || notification;
        const title = payload?.title || 'Recordatorio';
        const body = payload?.body || '';
        this.onLocalNotificationReceived(title, body);
      });

      // Acción realizada desde la notificación (tap)
      LocalNotifications.addListener('localNotificationActionPerformed', (action: any) => {
        const payload = action?.notification || action;
        const title = payload?.title || 'Recordatorio';
        const body = payload?.body || '';
        this.onLocalNotificationReceived(title, body);
      });
    } catch (e) {
      // Si falla (por ejemplo en navegador sin permisos o plugin faltante), seguimos sin bloqueo
      console.warn('Inicialización de notificaciones falló', e);
    }
  }

  private async ensureNotificationPermissions(): Promise<void> {
    try {
      await LocalNotifications.requestPermissions();
    } catch (e) {
      // ignore
    }
  }

  private async onLocalNotificationReceived(title: string, body: string): Promise<void> {
    try {
      // Haptics (intentar, con fallback a navigator.vibrate)
      try {
        await Haptics.notification({ type: 'SUCCESS' } as any);
      } catch (e) {
        try { (navigator as any).vibrate?.([200, 100, 200]); } catch (_) { }
      }

      // Sonido corto en primer plano
      this.playBeep();

      // Toast flotante
      this.showToast(`${title}: ${body}`, 'warning');
    } catch (e) {
      // ignore
    }
  }

  private async showToast(message: string, color = 'warning'): Promise<void> {
    try {
      const toast = await this.toastCtrl.create({
        message,
        duration: 3500,
        color,
        position: 'top'
      });
      await toast.present();
    } catch (e) {
      // ignore
    }
  }

  private playBeep(): void {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 1000;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 250);
    } catch (e) {
      // ignore
    }
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
      id: this.getNextId(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tasks.push(newTask);
    this.addToHistory(newTask.id, 'created', null, newTask);
    this.saveToStorage();
    this.updateTasksSubject();

    // Programar notificación si corresponde (no bloqueante)
    this.scheduleNotificationForTask(newTask).catch(() => { /* no bloquear */ });
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

      // Re-programar notificación: cancelar la anterior y crear una nueva si aplica
      const updated = this.tasks[index];
      this.cancelNotificationById(updated.notificationId ?? updated.id).catch(() => {});
      this.scheduleNotificationForTask(updated).catch(() => {});
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

      // Cancelar notificación asociada
      this.cancelNotificationById(task.notificationId ?? task.id).catch(() => {});
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

      // Si se completó la tarea, cancelar la notificación pendiente
      if (newCompleted) {
        this.cancelNotificationById(task.notificationId ?? task.id).catch(() => {});
      }
    }
  }

  /** Programa una notificación local para la tarea si tiene `notifyBeforeMinutes` */
  private async scheduleNotificationForTask(task: Task): Promise<void> {
    try {
      if (!task.notifyBeforeMinutes) return;

      const fireTime = new Date(task.date).getTime() - (task.notifyBeforeMinutes * 60000);
      const at = new Date(fireTime <= Date.now() ? Date.now() + 5000 : fireTime);

      await this.ensureNotificationPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: task.id,
            title: 'Tarea próxima a vencer',
            body: task.title,
            schedule: { at },
            sound: 'default'
          }
        ]
      });

      task.notificationId = task.id;
      this.saveToStorage();
    } catch (e) {
      // Si falla la programación (p. ej. en navegador sin plugin), ignoramos.
      console.warn('No se pudo programar notificación', e);
    }
  }

  private async cancelNotificationById(id: number | undefined): Promise<void> {
    if (!id) return;
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] } as any);
    } catch (e) {
      // ignore
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