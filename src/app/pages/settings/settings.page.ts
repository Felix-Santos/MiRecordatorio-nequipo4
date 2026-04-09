import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { ColorUtil } from '../../utils/color.util';
import { AVAILABLE_LANGUAGES } from '../../constants/languages';
import { AVAILABLE_THEMES } from '../../constants/themes';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslatePipe]
})
export class SettingsPage implements OnInit {
  languages = AVAILABLE_LANGUAGES;
  selectedLanguage = 'es';

  themes = AVAILABLE_THEMES;
  selectedTheme = 'default';
  selectedThemePreview = '#0054e9';

  // Valores para tema personalizado
  customPrimary = '#0054e9';
  customBackground = '#f4f5f8';

  constructor(private settings: SettingsService) {}

  ngOnInit() {
    // Cargar idioma actual
    this.settings.language$.subscribe(lang => {
      this.selectedLanguage = lang;
    });

    // Cargar tema actual
    this.settings.theme$.subscribe(async theme => {
      this.selectedTheme = theme;
      if (theme === 'custom') {
        const custom = await this.settings.getCustomTheme();
        if (custom) {
          this.customPrimary = custom.primary;
          this.customBackground = custom.background;
        }
      }
      this.updatePreview();
    });
  }

  onLanguageChange(value: string) {
    this.settings.setLanguage(value);
  }

  onThemeChange(value: string) {
    if (value === 'custom') {
      this.selectedTheme = 'custom';
      this.updatePreview();
      return;
    }
    this.selectedTheme = value;
    this.settings.setTheme(value);
    this.updatePreview();
  }

  async saveCustomTheme() {
    const primary = this.customPrimary || '#0054e9';
    const bg = this.customBackground || '#f4f5f8';
    const rgb = ColorUtil.hexToRgb(primary) || '0,84,233';
    await this.settings.setCustomTheme({
      primary,
      primaryRgb: rgb,
      contrast: '#ffffff',
      background: bg
    });
    this.selectedTheme = 'custom';
    this.updatePreview();
  }

  updatePreview() {
    const presetColors: { [key: string]: string } = {
      default: ColorUtil.getComputedPrimaryColor(),
      blue: '#007bff',
      green: '#2e7d32',
      red: '#e53935',
      dark: '#222428',
      custom: this.customPrimary || '#0054e9'
    };

    this.selectedThemePreview = presetColors[this.selectedTheme] || '#0054e9';
  }

}
