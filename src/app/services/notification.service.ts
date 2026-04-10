import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Task } from '../models/task.model';
import { Platform } from '@ionic/angular';

/**
 * Servicio de Notificaciones para tareas próximas a vencer
 *
 * Propósito:
 * - Programar notificaciones locales para tareas usando Capacitor
 * - Funciona en dispositivos físicos y emuladores Android
 * - Verifica permisos automáticamente
 *
 * Notas:
 * - En desarrollo: las notificaciones aparecen aunque la app esté abierta
 * - En emulador: requiere que Google Play Services esté instalado
 * - En dispositivo: requiere permisos en AndroidManifest.xml
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private scheduledNotifications: Map<number, number> = new Map(); // taskId -> notificationId

  constructor(private platform: Platform) {
    this.initNotifications();
  }

  /**
   * Inicializa el servicio de notificaciones
   * Se ejecuta cuando la app se carga
   */
  private async initNotifications(): Promise<void> {
    // Esperar a que Capacitor esté listo
    await this.platform.ready();

    // Solicitar permisos en iOS/Android (no hace nada en web)
    try {
      const result = await LocalNotifications.requestPermissions();
      console.log('Permisos de notificaciones:', result);
    } catch (error) {
      console.warn('Error solicitando permisos de notificaciones:', error);
    }

    // Escuchar cuando el usuario hace click en una notificación
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notificación ejecutada:', notification);
      // Aquí puedes navegar a detalles de la tarea si lo deseas
    });

    // Escuchar notificaciones recibidas (cuando la app está abierta)
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notificación recibida:', notification);
    });
  }

  /**
   * Programa una notificación para una tarea
   * @param task La tarea para la cual programar la notificación
   */
  async scheduleNotification(task: Task): Promise<void> {
    // Si la tarea no tiene configurada la notificación, no hacer nada
    if (!task.notifyBeforeMinutes || task.notifyBeforeMinutes <= 0) {
      console.log('Tarea sin notificación configurada:', task.id);
      return;
    }

    // Si ya existe una notificación para esta tarea, cancelarla primero
    const existingNotificationId = this.scheduledNotifications.get(task.id);
    if (existingNotificationId) {
      await this.cancelNotification(task.id);
    }

    try {
      // Calcular cuándo programar la notificación
      const taskDate = new Date(task.date);
      const notificationDate = new Date(taskDate.getTime() - task.notifyBeforeMinutes * 60000);

      // No programar si la fecha ya pasó
      if (notificationDate < new Date()) {
        console.log('Fecha de notificación ya pasó para tarea:', task.id);
        return;
      }

      // Crear ID único para la notificación (combinación de timestamp y taskId para evitar conflictos)
      const notificationId = task.id;

      // Programar la notificación
      const result = await LocalNotifications.schedule({
        notifications: [
          {
            id: notificationId,
            title: '⏰ Recordatorio de Tarea',
            body: `"${task.title}" está por vencer`,
            smallIcon: 'icon', // debe existir en res/drawable/icon.*
            largeIcon: 'icon',
            // Imagen de notificación (Android 5.0+)
            // largeBody: task.description || '',
            summaryText: `Prioridad: ${task.priority}`,
            schedule: {
              at: notificationDate // Programar para la fecha calculada
            },
            actionTypeId: 'taskNotification',
            // Datos personalizados que se pasarán cuando se haga click
            extra: {
              taskId: task.id.toString(),
              taskTitle: task.title
            }
          }
        ]
      });

      // Guardar el registro de que esta notificación fue programada
      this.scheduledNotifications.set(task.id, notificationId);
      console.log(`✅ Notificación programada para tarea ${task.id} a las ${notificationDate.toLocaleString()}`);

    } catch (error) {
      console.error('Error al programar notificación para tarea:', task.id, error);
    }
  }

  /**
   * Cancela la notificación de una tarea
   * @param taskId ID de la tarea
   */
  async cancelNotification(taskId: number): Promise<void> {
    const notificationId = this.scheduledNotifications.get(taskId);
    if (!notificationId) return;

    try {
      await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
      this.scheduledNotifications.delete(taskId);
      console.log(`❌ Notificación cancelada para tarea ${taskId}`);
    } catch (error) {
      console.error('Error al cancelar notificación:', error);
    }
  }

  /**
   * Reprograma todas las notificaciones de las tareas activas
   * Útil cuando se cargan tareas o cambia la configuración
   * @param tasks Lista de tareas
   */
  async reprogramAllNotifications(tasks: Task[]): Promise<void> {
    console.log('🔄 Reprogramando todas las notificaciones...');

    // Cancelar todas las notificaciones existentes
    const notificationIds = Array.from(this.scheduledNotifications.values());
    if (notificationIds.length > 0) {
      await LocalNotifications.cancel({
        notifications: notificationIds.map(id => ({ id }))
      });
    }
    this.scheduledNotifications.clear();

    // Programar notificaciones para todas las tareas activas sin completar
    const uncompletedTasks = tasks.filter(task => !task.completed && !task.deletedAt);
    for (const task of uncompletedTasks) {
      await this.scheduleNotification(task);
    }

    console.log(`✅ Se reprogramaron ${uncompletedTasks.length} notificaciones`);
  }

  /**
   * Obtiene el número de notificaciones activas
   */
  async getPendingNotifications(): Promise<any> {
    try {
      const result = await LocalNotifications.getPending();
      return result;
    } catch (error) {
      console.error('Error obteniendo notificaciones pendientes:', error);
      return null;
    }
  }

  /**
   * Cancela todas las notificaciones
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      // Obtener todas las notificaciones pendientes
      const pending = await LocalNotifications.getPending();
      if (pending && pending.notifications && pending.notifications.length > 0) {
        const notificationIds = pending.notifications.map(n => ({ id: n.id }));
        await LocalNotifications.cancel({ notifications: notificationIds });
      }
      this.scheduledNotifications.clear();
      console.log('Todas las notificaciones fueron canceladas');
    } catch (error) {
      console.error('Error cancelando todas las notificaciones:', error);
    }
  }

  /**
   * Muestra una notificación de prueba (para debugging)
   * Aparece después de 5 segundos
   */
  async showTestNotification(): Promise<void> {
    try {
      const testDate = new Date();
      testDate.setSeconds(testDate.getSeconds() + 5); // Notificación en 5 segundos

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999,
            title: '🧪 NOTIFICACIÓN DE PRUEBA',
            body: 'Si ves esto, las notificaciones funcionan correctamente',
            smallIcon: 'icon',
            schedule: { at: testDate }
          }
        ]
      });
      console.log('📲 Notificación de prueba programada para dentro de 5 segundos');
    } catch (error) {
      console.error('Error en notificación de prueba:', error);
    }
  }
}
