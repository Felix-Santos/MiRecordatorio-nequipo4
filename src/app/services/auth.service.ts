import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // En producción, usar hash
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private users: User[] = [];
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  /**
   * Carga los usuarios desde localStorage (simulando base de datos)
   */
  private loadUsers(): void {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (stored) {
      this.users = JSON.parse(stored);
    } else {
      // Usuario por defecto para demo
      this.users = [{
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: '123456', // En producción, hashear
        createdAt: new Date().toISOString()
      }];
      this.saveUsers();
    }
  }

  /**
   * Guarda usuarios en localStorage
   */
  private saveUsers(): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(this.users));
  }

  /**
   * Carga el usuario actual desde localStorage
   */
  private loadCurrentUser(): void {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  /**
   * Guarda el usuario actual en localStorage
   */
  private saveCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
    this.currentUserSubject.next(user);
  }

  /**
   * Registra un nuevo usuario
   */
  register(username: string, email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
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
      this.saveUsers();
      console.log('Usuario registrado:', newUser);
      console.log('Lista de usuarios:', this.users);
      observer.next(true);
      observer.complete();
    });
  }

  /**
   * Inicia sesión con credenciales
   */
  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      console.log('Intentando login con:', username, password);
      console.log('Usuarios disponibles:', this.users);
      const user = this.users.find(u => u.username === username && u.password === password);
      if (user) {
        console.log('Usuario encontrado:', user);
        this.saveCurrentUser(user);
        observer.next(true);
      } else {
        console.log('Usuario no encontrado');
        observer.next(false);
      }
      observer.complete();
    });
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    this.saveCurrentUser(null);
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Genera el siguiente ID para usuario
   */
  private getNextUserId(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
  }
}