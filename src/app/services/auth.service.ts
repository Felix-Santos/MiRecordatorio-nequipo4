import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Servicio de autenticación (simulado para la app).
 *
 * Propósito:
 * - Gestionar registro, login y sesión usando localStorage como persistencia.
 * - Proveer un Observable (`currentUser$`) para que la UI reaccione a cambios de sesión.
 *
 * Advertencias (leer con atención):
 * - Este servicio es solo para desarrollo/demo. No usar tal cual en producción.
 * - Las contraseñas aquí se guardan en texto plano; en producción siempre:
 *     - usar HTTPS
 *     - almacenar hashes de contraseña (ej. bcrypt)
 *     - delegar autenticación a un backend seguro (JWT/OAuth)
 */

export interface User {
  id: number; // identificador único
  username: string; // nombre de usuario visible
  email: string; // correo asociado (puede servir como login alternativo)
  password: string; // EN PRODUCCIÓN: nunca guardar así (usar hash)
  createdAt: string; // fecha de creación en formato ISO
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject que guarda el usuario actual (o null si no hay sesión).
  // Se usa BehaviorSubject para que los suscriptores reciban inmediatamente el último valor.
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  // Observable público para que componentes/servicios se suscriban sin poder emitir valores.
  public currentUser$ = this.currentUserSubject.asObservable();

  // Array local de usuarios; persistido en localStorage para simular una base de datos.
  private users: User[] = [];
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(private storageService: StorageService) {
    // Iniciar carga asíncrona de datos desde el almacenamiento persistente.
    // No bloqueamos el constructor: emitiremos cuando los datos estén listos.
    this.init();
  }

  private async init(): Promise<void> {
    await this.storageService.ready();
    await this.loadUsers();
    await this.loadCurrentUser();
  }

  /**
   * Carga los usuarios desde localStorage (simula una base de datos).
   * Si no existen usuarios, crea uno por defecto para propósitos de demo.
   */
  private async loadUsers(): Promise<void> {
    const stored = await this.storageService.get<User[]>(this.USERS_KEY);
    if (stored && Array.isArray(stored)) {
      this.users = stored;
    } else {
      // Usuario por defecto para demo. Idealmente esto no debería existir fuera del entorno de pruebas.
      this.users = [{
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: '123456', // EN PRODUCCIÓN: usar hash
        createdAt: new Date().toISOString()
      }];
      await this.saveUsers();
    }
  }

  /**
   * Guarda el array de usuarios en localStorage.
   * Nota: aquí se persisten contraseñas en texto plano (solo para demo).
   */
  private async saveUsers(): Promise<void> {
    await this.storageService.set(this.USERS_KEY, this.users);
  }

  /**
   * Carga el usuario actual (sesión) desde localStorage y lo emite en el subject.
   */
  private async loadCurrentUser(): Promise<void> {
    const stored = await this.storageService.get<User | null>(this.CURRENT_USER_KEY);
    if (stored) {
      this.currentUserSubject.next(stored);
    }
  }

  /**
   * Guarda (o elimina) el usuario actual en localStorage y notifica a los suscriptores.
   * Pasar `null` cierra la sesión.
   */
  private async saveCurrentUser(user: User | null): Promise<void> {
    if (user) {
      await this.storageService.set(this.CURRENT_USER_KEY, user);
    } else {
      await this.storageService.remove(this.CURRENT_USER_KEY);
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Registra un nuevo usuario.
   *
   * Comportamiento:
   * - Verifica si ya existe un usuario con el mismo username o email.
   * - Si existe, emite `false`.
   * - Si no existe, crea el usuario, lo persiste y emite `true`.
   *
   * Mejora sugerida:
   * - Devolver más información (por ejemplo, el usuario creado o errores específicos).
   * - Mover la lógica a un backend real y hashear contraseñas.
   */
  register(username: string, email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      (async () => {
        // Verificar si el usuario ya existe
        const existingUser = this.users.find(u => u.username === username || u.email === email);
        if (existingUser) {
          console.log('Usuario ya existe:', existingUser);
          observer.next(false);
          observer.complete();
          return;
        }

        // Crear nuevo usuario
        const newUser: User = {
          id: this.getNextUserId(),
          username,
          email,
          password, // En producción: hash(password)
          createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        await this.saveUsers();
        console.log('Usuario registrado:', newUser);
        console.log('Lista de usuarios:', this.users);
        observer.next(true);
        observer.complete();
      })().catch(err => {
        observer.error(err);
      });
    });
  }

  /**
   * Inicia sesión con credenciales.
   *
   * - Busca un usuario que coincida en username y password.
   * - Si lo encuentra, guarda la sesión y emite `true`.
   * - Si no, emite `false`.
   *
   * Observaciones:
   * - Actualmente compara password en texto plano; reemplazar por verificación segura en backend.
   * - Podría devolver un token JWT en una implementación real.
   */
  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      (async () => {
        console.log('Intentando login con:', username);
        console.log('Usuarios disponibles:', this.users);
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
          console.log('Usuario encontrado:', user);
          await this.saveCurrentUser(user);
          observer.next(true);
        } else {
          console.log('Usuario no encontrado');
          observer.next(false);
        }
        observer.complete();
      })().catch(err => {
        observer.error(err);
      });
    });
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): void {
    this.saveCurrentUser(null);
  }

  /**
   * Devuelve el usuario actual (valor sincrónico).
   * Útil cuando no queremos suscribirnos al observable.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Indica si hay un usuario autenticado.
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Genera el siguiente ID para usuario de forma simple:
   * - Si hay usuarios, toma el máximo id y suma 1.
   * - Si no hay usuarios, devuelve 1.
   *
   * Nota: en un backend real el ID lo asignaría el servidor.
   */
  private getNextUserId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
  }
}