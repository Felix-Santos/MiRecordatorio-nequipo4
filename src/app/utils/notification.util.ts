/**
 * Utilidades para conversión de tiempo de notificación
 */
export class NotificationUtil {
  /**
   * Convierte la cantidad y unidad de notificación a minutos
   * @param amount Cantidad (ej: 1, 2, 3, etc)
   * @param unit Unidad ('hours' o 'days')
   * @returns Minutos equivalentes, o undefined si amount <= 0
   * @example
   *   toMinutes(1, 'hours') // -> 60
   *   toMinutes(1, 'days')  // -> 1440
   *   toMinutes(2, 'days')  // -> 2880
   */
  static toMinutes(amount: number | string, unit: 'hours' | 'days'): number | undefined {
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const finalAmount = parsedAmount || 0;

    if (finalAmount <= 0) {
      return undefined;
    }

    return Math.round(unit === 'days' ? finalAmount * 24 * 60 : finalAmount * 60);
  }

  /**
   * Convierte minutos a cantidad y unidad
   * Prefiere días si el resultado es un número entero de días
   * @param minutes Minutos totales
   * @returns Objeto con {amount, unit}, o undefined si minutes es 0 o undefined
   * @example
   *   fromMinutes(60)    // -> {amount: 1, unit: 'hours'}
   *   fromMinutes(1440)  // -> {amount: 1, unit: 'days'}
   *   fromMinutes(2880)  // -> {amount: 2, unit: 'days'}
   */
  static fromMinutes(minutes: number | undefined): { amount: number; unit: 'hours' | 'days' } | undefined {
    if (!minutes || minutes <= 0) {
      return undefined;
    }

    // Preferir días si el resultado es un número entero
    if (minutes % 1440 === 0) {
      return {
        unit: 'days',
        amount: Math.round(minutes / 1440)
      };
    }

    // Si no, usar horas
    return {
      unit: 'hours',
      amount: Math.round(minutes / 60)
    };
  }
}
