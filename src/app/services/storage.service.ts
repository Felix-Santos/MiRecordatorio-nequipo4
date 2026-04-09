import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Servicio ligero que envuelve `@ionic/storage-angular`.
 * Permite un acceso consistente y asíncrono al almacenamiento.
 * En entornos nativos, Ionic Storage puede utilizar SQLite (si está instalado),
 * ofreciendo persistencia robusta adecuada para producción.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private useLocalStorageFallback = false;

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    try {
      this._storage = await this.storage.create();
    } catch (e) {
      // si falla, activamos fallback a localStorage para asegurar persistencia en navegador
      this._storage = null;
      this.useLocalStorageFallback = typeof localStorage !== 'undefined';
    }
  }

  async ready(): Promise<void> {
    if (!this._storage) await this.init();
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.ready();
    if (this._storage) {
      await this._storage.set(key, value);
      return;
    }

    if (this.useLocalStorageFallback) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // ignore
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    await this.ready();
    if (this._storage) {
      const v = await this._storage.get(key);
      return v === undefined ? null : (v as T);
    }

    if (this.useLocalStorageFallback) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return null;
        return JSON.parse(raw) as T;
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  async remove(key: string): Promise<void> {
    await this.ready();
    if (this._storage) {
      await this._storage.remove(key);
      return;
    }

    if (this.useLocalStorageFallback) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // ignore
      }
    }
  }
}
