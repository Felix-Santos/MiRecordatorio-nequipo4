import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private langSubject = new BehaviorSubject<string>(localStorage.getItem('app_language') || 'es');
  public lang$ = this.langSubject.asObservable();

  private translations: { [lang: string]: { [key: string]: string } } = {
    es: {
      'APP.TITLE': 'Mi recordatorio',
      'LIST.TITLE': 'Mi recordatorio',
      'LIST.HISTORY': 'HISTORIAL',
      'LIST.TRASH': 'PAPELERA',
      'LIST.CALENDAR': 'CALENDARIO',
      'SEGMENT.ALL': 'Todas',
      'SEGMENT.PRIORITY': 'Por Prioridad',
      'SEGMENT.COMPLETED': 'Completadas',
      'CALENDAR.TITLE': 'Calendario',
      'CALENDAR.TASKS_FOR': 'Tareas para {{date}}',
      'CALENDAR.NO_TASKS': 'No hay tareas programadas para esta fecha.',
      'SETTINGS.TITLE': 'Ajustes',
      'SETTINGS.LANGUAGE': 'Idioma',
      'SETTINGS.COLOR': 'Color',
      'SETTINGS.PRIMARY_COLOR': 'Color primario',
      'SETTINGS.BACKGROUND': 'Color de fondo',
      'BUTTON.CLOSE': 'Cerrar',
      'BUTTON.APPLY': 'Aplicar',
      'BUTTON.ADD': 'Añadir',
      'BUTTON.SAVE': 'Guardar',
      'BUTTON.CLEAR': 'Limpiar',
      'ALERT.CONFIRM_DELETE_HEADER': 'Confirmar eliminación',
      'ALERT.CONFIRM_DELETE_MESSAGE': '¿Realmente quieres eliminar esta tarea?',
      'ALERT.CANCEL': 'Cancelar',
      'ALERT.DELETE': 'Eliminar'
      ,
      // Login
      'LOGIN.TITLE': 'Iniciar Sesión',
      'LOGIN.USER': 'Usuario',
      'LOGIN.PASSWORD': 'Contraseña',
      'LOGIN.EMAIL': 'Correo Electrónico',
      'LOGIN.LOGIN_BUTTON': 'Iniciar Sesión',
      'LOGIN.REGISTER_BUTTON': 'Registrarse',
      'LOGIN.ALREADY_HAVE_ACCOUNT': '¿Ya tienes cuenta? Inicia Sesión',
      'LOGIN.DONT_HAVE_ACCOUNT': '¿No tienes cuenta? Regístrate',
      'LOGIN.FILL_FIELDS_MSG': 'Por favor, complete todos los campos',
      'LOGIN.CREDENTIALS_INVALID': 'Credenciales incorrectas',
      'LOGIN.REGISTER_SUCCESS': 'Usuario registrado exitosamente. Ahora puede iniciar sesión.',
      'LOGIN.USER_EXISTS': 'El usuario o email ya existe',
      'DEMO.INFO': 'Demo: Usuario: admin, Contraseña: 123456',

      // Nueva tarea
      'NEW.TITLE': 'Nueva Tarea',
      'NEW.TASK_TITLE_LABEL': 'Título de la Tarea',
      'NEW.DESCRIPTION_LABEL': 'Descripción',
      'NEW.DESCRIPTION_PLACEHOLDER': 'Descripción de la tarea...',
      'NEW.DUE_DATE_LABEL': 'Fecha Límite',
      'NEW.PRIORITY_LABEL': 'Prioridad',
      'NEW.TOAST_SAVED': 'Tarea guardada exitosamente',
      'NEW.TOAST_FILL': 'Por favor complete título y fecha',
      'NEW.NOTIFY_BEFORE_LABEL': 'Notificar antes de',
      'NEW.NOTIFY_BEFORE_HELPER': 'Especifica con cuánto tiempo de anticipación quieres recibir la notificación.',
      'EDIT.NOTIFY_BEFORE_LABEL': 'Notificar antes de',
      'EDIT.NOTIFY_BEFORE_HELPER': 'Especifica con cuánto tiempo de anticipación quieres recibir la notificación.',
      'UNIT.HOURS': 'Horas',
      'UNIT.DAYS': 'Días',
      'VOICE.INPUT_MSG': 'Funcionalidad de entrada por voz próximamente disponible',

      // Historial
      'HISTORY.TITLE': 'Historial',
      'HISTORY.NO_ACTIONS': 'No hay acciones registradas aún.',
      'HISTORY.INFO': 'Las acciones sobre tus tareas aparecerán aquí.',
      'HISTORY.CLEAR_CONFIRM_TITLE': 'Limpiar historial',
      'HISTORY.CLEAR_CONFIRM_MESSAGE': '¿Estás seguro que deseas eliminar todo el historial? Esta acción no se puede deshacer.',

      // Acciones
      'ACTION.CREATED': 'Creada',
      'ACTION.UPDATED': 'Actualizada',
      'ACTION.COMPLETED': 'Completada',
      'ACTION.DELETED': 'Eliminada',
      'ACTION.RESTORED': 'Restaurada',

      // Papelera
      'TRASH.TITLE': 'Papelera',
      'TRASH.NO_TASKS': 'No hay tareas eliminadas.',
      'TRASH.INFO': 'Las tareas eliminadas aparecerán aquí para su recuperación.',
      'TRASH.DELETED_AT': 'Eliminada: {{date}}',
      'BUTTON.RESTORE': 'Restaurar',
      'BUTTON.DELETE_PERMANENT': 'Eliminar permanentemente',

      // Editar
      'EDIT.TITLE': 'Editar Tarea',
      'EDIT.TITLE_LABEL': 'Título',
      'EDIT.DESCRIPTION_LABEL': 'Descripción',
      'EDIT.DATE_LABEL': 'Fecha',
      'EDIT.BUTTON_SAVE': 'Guardar cambios',
      'EDIT.BUTTON_DELETE': 'Eliminar',
      'EDIT.NOT_FOUND': 'Tarea no encontrada',

      // Prioridades
      'PRIORITY.ALTA': 'Alta',
      'PRIORITY.MEDIA': 'Media',
      'PRIORITY.BAJA': 'Baja'
    },
    en: {
      'APP.TITLE': 'My Reminder',
      'LIST.TITLE': 'My Reminder',
      'LIST.HISTORY': 'HISTORY',
      'LIST.TRASH': 'TRASH',
      'LIST.CALENDAR': 'CALENDAR',
      'SEGMENT.ALL': 'All',
      'SEGMENT.PRIORITY': 'By Priority',
      'SEGMENT.COMPLETED': 'Completed',
      'CALENDAR.TITLE': 'Calendar',
      'CALENDAR.TASKS_FOR': 'Tasks for {{date}}',
      'CALENDAR.NO_TASKS': 'No tasks scheduled for this date.',
      'SETTINGS.TITLE': 'Settings',
      'SETTINGS.LANGUAGE': 'Language',
      'SETTINGS.COLOR': 'Color',
      'SETTINGS.PRIMARY_COLOR': 'Primary color',
      'SETTINGS.BACKGROUND': 'Background color',
      'BUTTON.CLOSE': 'Close',
      'BUTTON.APPLY': 'Apply',
      'BUTTON.ADD': 'Add',
      'BUTTON.SAVE': 'Save',
      'BUTTON.CLEAR': 'Clear',
      'ALERT.CONFIRM_DELETE_HEADER': 'Confirm delete',
      'ALERT.CONFIRM_DELETE_MESSAGE': 'Do you really want to delete this task?',
      'ALERT.CANCEL': 'Cancel',
      'ALERT.DELETE': 'Delete',

      // Login
      'LOGIN.TITLE': 'Login',
      'LOGIN.USER': 'Username',
      'LOGIN.PASSWORD': 'Password',
      'LOGIN.EMAIL': 'Email',
      'LOGIN.LOGIN_BUTTON': 'Sign In',
      'LOGIN.REGISTER_BUTTON': 'Register',
      'LOGIN.ALREADY_HAVE_ACCOUNT': 'Already have an account? Sign In',
      'LOGIN.DONT_HAVE_ACCOUNT': "Don't have an account? Register", 
      'LOGIN.FILL_FIELDS_MSG': 'Please fill all fields',
      'LOGIN.CREDENTIALS_INVALID': 'Invalid credentials',
      'LOGIN.REGISTER_SUCCESS': 'User registered successfully. You can now log in.',
      'LOGIN.USER_EXISTS': 'User or email already exists',
      'DEMO.INFO': 'Demo: User: admin, Password: 123456',

      // Nueva tarea
      'NEW.TITLE': 'New Task',
      'NEW.TASK_TITLE_LABEL': 'Task Title',
      'NEW.DESCRIPTION_LABEL': 'Description',
      'NEW.DESCRIPTION_PLACEHOLDER': 'Task description...',
      'NEW.DUE_DATE_LABEL': 'Due Date',
      'NEW.PRIORITY_LABEL': 'Priority',
      'NEW.TOAST_SAVED': 'Task saved successfully',
      'NEW.TOAST_FILL': 'Please fill title and date',
      'NEW.NOTIFY_BEFORE_LABEL': 'Notify before',
      'NEW.NOTIFY_BEFORE_HELPER': 'Specify how much time in advance you want to be notified.',
      'EDIT.NOTIFY_BEFORE_LABEL': 'Notify before',
      'EDIT.NOTIFY_BEFORE_HELPER': 'Specify how much time in advance you want to be notified.',
      'UNIT.HOURS': 'Hours',
      'UNIT.DAYS': 'Days',
      'VOICE.INPUT_MSG': 'Voice input coming soon',

      // Historial
      'HISTORY.TITLE': 'History',
      'HISTORY.NO_ACTIONS': 'No actions recorded yet.',
      'HISTORY.INFO': 'Actions on your tasks will appear here.',
      'HISTORY.CLEAR_CONFIRM_TITLE': 'Clear history',
      'HISTORY.CLEAR_CONFIRM_MESSAGE': 'Are you sure you want to clear all history? This action cannot be undone.',

      // Acciones
      'ACTION.CREATED': 'Created',
      'ACTION.UPDATED': 'Updated',
      'ACTION.COMPLETED': 'Completed',
      'ACTION.DELETED': 'Deleted',
      'ACTION.RESTORED': 'Restored',

      // Papelera
      'TRASH.TITLE': 'Trash',
      'TRASH.NO_TASKS': 'No deleted tasks.',
      'TRASH.INFO': 'Deleted tasks will appear here for recovery.',
      'TRASH.DELETED_AT': 'Deleted: {{date}}',
      'BUTTON.RESTORE': 'Restore',
      'BUTTON.DELETE_PERMANENT': 'Delete Permanently',

      // Editar
      'EDIT.TITLE': 'Edit Task',
      'EDIT.TITLE_LABEL': 'Title',
      'EDIT.DESCRIPTION_LABEL': 'Description',
      'EDIT.DATE_LABEL': 'Date',
      'EDIT.BUTTON_SAVE': 'Save changes',
      'EDIT.BUTTON_DELETE': 'Delete',
      'EDIT.NOT_FOUND': 'Task not found',

      // Prioridades
      'PRIORITY.ALTA': 'High',
      'PRIORITY.MEDIA': 'Medium',
      'PRIORITY.BAJA': 'Low'
    }
  };

  constructor() {}

  setLanguage(lang: string) {
    localStorage.setItem('app_language', lang);
    this.langSubject.next(lang);
  }

  translate(key: string, params?: { [k: string]: string }): string {
    const lang = this.langSubject.value || 'es';
    const dict = this.translations[lang] || this.translations['es'];
    let txt = dict[key] ?? key;
    if (params) {
      Object.keys(params).forEach(k => {
        txt = txt.replace(new RegExp(`{{${k}}}`, 'g'), params[k]);
      });
    }
    return txt;
  }
}
