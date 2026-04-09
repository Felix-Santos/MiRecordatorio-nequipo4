import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {
  
  /**
   * Formatea fecha y hora con formato corto
   * @example 2026-04-09 -> "9 abr, 14:30"
   */
  formatDateTime(dateString: string, locale: string = 'es-ES'): string {
    return new Date(dateString).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formatea solo fecha con nombre completo del día
   * @example 2026-04-09 -> "jueves 9 de abril de 2026"
   */
  formatDate(dateString: string, locale: string = 'es-ES'): string {
    return new Date(dateString).toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formatea solo hora
   * @example 2026-04-09T14:30:00Z -> "14:30"
   */
  formatTime(dateString: string, locale: string = 'es-ES'): string {
    return new Date(dateString).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
