import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from './translate.service';
import { StorageService } from './storage.service';
import { ColorUtil } from '../utils/color.util';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly LANG_KEY = 'app_language';
  private readonly THEME_KEY = 'app_theme';
  private readonly CUSTOM_KEY = 'app_custom_theme';

  // Inicializar con valores por defecto; luego los sobrescribimos desde almacenamiento.
  private languageSubject = new BehaviorSubject<string>('es');
  private themeSubject = new BehaviorSubject<string>('default');

  public language$ = this.languageSubject.asObservable();
  public theme$ = this.themeSubject.asObservable();

  constructor(private translateService: TranslateService, private storage: StorageService) {
    // Inicialización asíncrona: leer valores guardados y aplicar idioma/tema.
    this.init();
  }

  private async init() {
    try {
      const storedLang = await this.storage.get<string>(this.LANG_KEY);
      if (storedLang) this.languageSubject.next(storedLang);
      this.applyLanguage(this.languageSubject.value);

      const storedTheme = await this.storage.get<string>(this.THEME_KEY);
      const theme = storedTheme || this.themeSubject.value;
      this.themeSubject.next(theme);

      if (theme === 'custom') {
        const custom = await this.storage.get(this.CUSTOM_KEY) as any;
        if (custom) {
          this.applyCustomTheme(custom);
        } else {
          this.applyTheme(theme);
        }
      } else {
        this.applyTheme(theme);
      }

      // sincronizar con TranslateService
      this.translateService.setLanguage(this.languageSubject.value);
    } catch (e) {
      // si algo falla, aplicar los valores por defecto
      this.applyLanguage(this.languageSubject.value);
      this.applyTheme(this.themeSubject.value);
      this.translateService.setLanguage(this.languageSubject.value);
    }
  }

  async setLanguage(lang: string) {
    await this.storage.set(this.LANG_KEY, lang);
    this.languageSubject.next(lang);
    this.applyLanguage(lang);
    this.translateService.setLanguage(lang);
  }

  async setTheme(theme: string) {
    await this.storage.set(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  async setCustomTheme(colors: { primary: string; primaryRgb: string; contrast: string; background: string }) {
    await this.storage.set(this.CUSTOM_KEY, colors);
    await this.storage.set(this.THEME_KEY, 'custom');
    this.themeSubject.next('custom');
    this.applyCustomTheme(colors);
  }

  async getCustomTheme(): Promise<{ primary: string; primaryRgb: string; contrast: string; background: string } | null> {
    const raw = await this.storage.get(this.CUSTOM_KEY) as any;
    if (!raw) return null;
    try {
      return raw as { primary: string; primaryRgb: string; contrast: string; background: string };
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
      const textRgb = ColorUtil.hexToRgb(p.text || '#111111') || '17,17,17';
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
      const textColor = ColorUtil.isColorDark(c.background) ? '#ffffff' : '#111111';
      root.style.setProperty('--ion-text-color', textColor);
      const textRgb = ColorUtil.hexToRgb(textColor) || '17,17,17';
      root.style.setProperty('--ion-text-color-rgb', textRgb);
      // Usar valores neutros para item/card si no proporcionados
      root.style.setProperty('--ion-item-background', '#ffffff');
      root.style.setProperty('--ion-card-background', '#ffffff');
      root.style.setProperty('--ion-color-success', '#10dc60');
    } catch (e) {
      // no DOM
    }
  }


}
