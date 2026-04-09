/**
 * Utilidades para manipulación y conversión de colores.
 * Centraliza la lógica duplicada en settings.service, settings.page y settings-modal.
 */
export class ColorUtil {
  /**
   * Convierte color HEX a formato RGB string
   * @example '#0054e9' -> '0,84,233'
   */
  static hexToRgb(hex: string): string | null {
    const h = (hex || '').replace('#', '').trim();
    if (!h || h.length !== 6) return null;

    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `${r},${g},${b}`;
  }

  /**
   * Determina si un color HEX es oscuro
   * Usa fórmula de luminancia: 0.299*R + 0.587*G + 0.114*B
   */
  static isColorDark(hex: string): boolean {
    if (!hex) return false;

    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map(s => s + s).join('');
    }
    if (h.length !== 6) return false;

    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128;
  }

  /**
   * Obtiene el color primario CSS computado del documento
   * Maneja conversiones de rgb/rgba a hex si es necesario
   */
  static getComputedPrimaryColor(): string {
    try {
      const root = getComputedStyle(document.documentElement);
      let color = root.getPropertyValue('--ion-color-primary').trim();

      if (!color) return '#0054e9';

      // Si está en formato rgb/rgba, convertir a hex
      if (color.startsWith('rgb')) {
        const nums = color.match(/\d+/g) || [];
        if (nums.length >= 3) {
          const hex = '#' + nums.slice(0, 3)
            .map(n => parseInt(n).toString(16).padStart(2, '0'))
            .join('');
          return hex;
        }
      }

      return color;
    } catch {
      return '#0054e9';
    }
  }
}
