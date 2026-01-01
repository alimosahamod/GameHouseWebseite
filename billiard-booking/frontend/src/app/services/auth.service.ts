import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

interface LoginResponse {
  success: boolean;
  user: {
    username: string;
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private isAuthenticatedSignal = signal<boolean>(false);
  private readonly AUTH_KEY = 'billiard_admin_auth';
  private readonly apiUrl = 'http://localhost:3000';

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    const isAuth = localStorage.getItem(this.AUTH_KEY) === 'true';
    this.isAuthenticatedSignal.set(isAuth);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap((response) => {
        if (response.success) {
          this.isAuthenticatedSignal.set(true);
          localStorage.setItem(this.AUTH_KEY, 'true');
        }
      }),
      catchError(() => {
        this.isAuthenticatedSignal.set(false);
        return of({ success: false, user: { username: '', id: 0 } });
      })
    );
  }

  logout() {
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated() {
    return this.isAuthenticatedSignal();
  }
}
