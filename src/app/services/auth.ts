import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface LoginRequest{
  email: string,
  password: string
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly API_URL = 'http://localhost:8000/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  constructor(private http: HttpClient, private router: Router) { }
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login/`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.http.post(`${this.API_URL}/logout/`, {}).subscribe({
      next: () => {
        this.clearStorage();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.clearStorage();  // incluso si falla, limpiar todo
        this.router.navigate(['/login']);
      }
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Error desconocido';
    if (error.status === 400) message = 'Credenciales inválidas';
    if (error.status === 403) message = 'Acceso denegado';
    if (error.status === 500) message = 'Error del servidor';
    return throwError(() => message);
  }






}
