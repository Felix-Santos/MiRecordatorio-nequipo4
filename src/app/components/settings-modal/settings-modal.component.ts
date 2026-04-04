import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslatePipe]
})
export class SettingsModalComponent {
  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' }
  ];
  selectedLanguage = 'es';

  constructor(private modalCtrl: ModalController, private settings: SettingsService) {
    this.settings.language$.subscribe(l => this.selectedLanguage = l);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  applyLanguage() {
    this.settings.setLanguage(this.selectedLanguage);
  }
  saveAndClose() {
    this.applyLanguage();
    this.close();
  }
}
