import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  loginData = {
    username: '',
    password: ''
  };

  registerData = {
    username: '',
    email: '',
    password: ''
  };

  isRegisterMode = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Maneja el inicio de sesión
   */
  onLogin(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.authService.login(this.loginData.username, this.loginData.password).subscribe(success => {
      if (success) {
        this.router.navigate(['/lista-tareas']);
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
    });
  }

  /**
   * Maneja el registro de nuevo usuario
   */
  onRegister(): void {
    if (!this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }

    this.authService.register(this.registerData.username, this.registerData.email, this.registerData.password)
      .subscribe(success => {
        if (success) {
          this.errorMessage = 'Usuario registrado exitosamente. Ahora puede iniciar sesión.';
          this.isRegisterMode = false; // Cambiar automáticamente a modo login
          this.registerData = { username: '', email: '', password: '' }; // Limpiar campos
        } else {
          this.errorMessage = 'El usuario o email ya existe';
        }
      });
  }

  /**
   * Alterna entre modo login y registro
   */
  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }
}