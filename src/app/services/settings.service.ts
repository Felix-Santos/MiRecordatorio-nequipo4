import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly LANG_KEY = 'app_language';
  private readonly THEME_KEY = 'app_theme';
  private readonly CUSTOM_KEY = 'app_custom_theme';

  private languageSubject = new BehaviorSubject<string>(this.getFromStorage(this.LANG_KEY) || 'es');
  private themeSubject = new BehaviorSubject<string>(this.getFromStorage(this.THEME_KEY) || 'default');

  public language$ = this.languageSubject.asObservable();
  public theme$ = this.themeSubject.asObservable();

  constructor(private translateService: TranslateService) {
    // aplicar al inicio
    this.applyLanguage(this.languageSubject.value);
    // Si existe un tema personalizado guardado, aplicarlo
    const theme = this.themeSubject.value;
    if (theme === 'custom') {
      const customRaw = this.getFromStorage(this.CUSTOM_KEY);
      if (customRaw) {
        try {
          const c = JSON.parse(customRaw);
          this.applyCustomTheme(c);
        } catch (e) {
          this.applyTheme(theme);
        }
      } else {
        this.applyTheme(theme);
      }
    } else {
      this.applyTheme(this.themeSubject.value);
    }
    // sincronizar con TranslateService
    this.translateService.setLanguage(this.languageSubject.value);
  }

  setLanguage(lang: string) {
    localStorage.setItem(this.LANG_KEY, lang);
    this.languageSubject.next(lang);
    this.applyLanguage(lang);
    this.translateService.setLanguage(lang);
  }

  setTheme(theme: string) {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  setCustomTheme(colors: { primary: string; primaryRgb: string; contrast: string; background: string }) {
    localStorage.setItem(this.CUSTOM_KEY, JSON.stringify(colors));
    localStorage.setItem(this.THEME_KEY, 'custom');
    this.themeSubject.next('custom');
    this.applyCustomTheme(colors);
  }

  getCustomTheme(): { primary: string; primaryRgb: string; contrast: string; background: string } | null {
    const raw = this.getFromStorage(this.CUSTOM_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  private getFromStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  private applyLanguage(lang: string) {
    try {
      const htmlLang = lang === 'en' ? 'en-US' : 'es-ES';
      document.documentElement.lang = htmlLang;
    } catch (e) {
      // entorno no DOM
    }
  }

  private applyTheme(theme: string) {
    const presets: { [k: string]: { primary: string; primaryRgb: string; contrast: string; background: string; text?: string; itemBg?: string; cardBg?: string; success?: string } } = {
      default: { primary: '#0054e9', primaryRgb: '0,84,233', contrast: '#ffffff', background: '#f4f5f8', text: '#111111', itemBg: '#ffffff', cardBg: '#ffffff', success: '#10dc60' },
      blue: { primary: '#007bff', primaryRgb: '0,123,255', contrast: '#ffffff', background: '#eaf2ff', text: '#111111', itemBg: '#ffffff', cardBg: '#ffffff', success: '#10dc60' },
      green: { primary: '#2e7d32', primaryRgb: '46,125,50', contrast: '#ffffff', background: '#eef7ee', text: '#0b3b0b', itemBg: '#ffffff', cardBg: '#ffffff', success: '#2e7d32' },
      red: { primary: '#e53935', primaryRgb: '229,57,53', contrast: '#ffffff', background: '#fff5f5', text: '#3b0b0b', itemBg: '#ffffff', cardBg: '#ffffff', success: '#10dc60' },
      dark: { primary: '#222428', primaryRgb: '34,36,40', contrast: '#ffffff', background: '#121212', text: '#ffffff', itemBg: '#1e1e1e', cardBg: '#1b1b1b', success: '#2dd36f' }
    };

    const p = presets[theme] || presets['default'];

    try {
      const root = document.documentElement;
      root.style.setProperty('--ion-color-primary', p.primary);
      root.style.setProperty('--ion-color-primary-rgb', p.primaryRgb);
      root.style.setProperty('--ion-color-primary-contrast', p.contrast);
      root.style.setProperty('--ion-background-color', p.background);
      root.style.setProperty('--ion-text-color', p.text || '#111');
      // also expose an RGB tuple for components that use the rgb var
      const textRgb = this.hexToRgb(p.text || '#111111') || '17,17,17';
      root.style.setProperty('--ion-text-color-rgb', textRgb);
      root.style.setProperty('--ion-item-background', p.itemBg || '#ffffff');
      root.style.setProperty('--ion-card-background', p.cardBg || '#ffffff');
      root.style.setProperty('--ion-color-success', p.success || '#10dc60');
    } catch (e) {
      // no DOM disponible
    }
  }

  private applyCustomTheme(c: { primary: string; primaryRgb: string; contrast: string; background: string }) {
    try {
      const root = document.documentElement;
      root.style.setProperty('--ion-color-primary', c.primary);
      root.style.setProperty('--ion-color-primary-rgb', c.primaryRgb);
      root.style.setProperty('--ion-color-primary-contrast', c.contrast);
      root.style.setProperty('--ion-background-color', c.background);
      // Determinar color de texto legible según el fondo
      const textColor = this.isColorDark(c.background) ? '#ffffff' : '#111111';
      root.style.setProperty('--ion-text-color', textColor);
      const textRgb = this.hexToRgb(textColor) || '17,17,17';
      root.style.setProperty('--ion-text-color-rgb', textRgb);
      // Usar valores neutros para item/card si no proporcionados
      root.style.setProperty('--ion-item-background', '#ffffff');
      root.style.setProperty('--ion-card-background', '#ffffff');
      root.style.setProperty('--ion-color-success', '#10dc60');
    } catch (e) {
      // no DOM
    }
  }

  private hexToRgb(hex: string): string | null {
    if (!hex) return null;
    let h = hex.replace('#', '').trim();
    if (h.length === 3) {
      h = h.split('').map(ch => ch + ch).join('');
    }
    if (h.length !== 6) return null;
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  private isColorDark(hex: string): boolean {
    if (!hex) return false;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(s => s + s).join('');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // fórmula simple de luminancia
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128;
  }
}
