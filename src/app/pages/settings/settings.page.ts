import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslatePipe]
})
export class SettingsPage {
  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' }
  ];
  selectedLanguage = 'es';

  constructor(private settings: SettingsService) {
    this.settings.language$.subscribe(l => this.selectedLanguage = l);
  }

  onLanguageChange(value: string) {
    this.settings.setLanguage(value);
  }
}
