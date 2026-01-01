import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal<string>('');
  password = signal<string>('');
  errorMessage = signal<string>('');
  loading = signal<boolean>(false);

  login() {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.authService.login(this.username(), this.password()).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage.set('Ungültiger Benutzername oder Passwort');
          this.password.set('');
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Ungültiger Benutzername oder Passwort');
        this.password.set('');
      }
    });
  }
}
