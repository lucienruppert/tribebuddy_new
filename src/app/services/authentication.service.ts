import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);
  public userRole$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // This is important so when the user refreshes the page, it doesnt log them out.
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const email = sessionStorage.getItem('userEmail');
    const name = sessionStorage.getItem('userName');

    if (email && name) {
      this.isLoggedIn$.next(true);
      this.userRole$.next('user');
    } else {
      this.isLoggedIn$.next(false);
    }
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const loginData = await this.loginUser(email, password);
      this.router.navigate(['/dashboard']);
      return loginData;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error && typedError.error.status) {
        throw new Error(typedError.error.status);
      }
      throw new Error('A belépés nem sikerült. Kérjük, próbáld újra!');
    }
  }

  private async loginUser(email: string, password: string): Promise<User> {
    const result$ = this.http.post<User>(
      `${this.apiUrl}/login`,
      { email, password },
      {
        withCredentials: true,
        observe: 'response',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    const response = await firstValueFrom(result$);
    const userData = response.body as User;

    // Get cookies from response headers
    const cookies = response.headers.getAll('Set-Cookie');
    if (cookies) {
      console.log('Received cookies:', cookies);
    }

    this.setBasicUserData(userData);
    return userData;
  }

  private setBasicUserData(userData: User): void {
    sessionStorage.setItem('userEmail', userData.email!);
    sessionStorage.setItem('userName', userData.name!);
    sessionStorage.setItem('userId', userData.id!);
    this.isLoggedIn$.next(true);
    this.userRole$.next(userData.role!);
  }

  public logout(): void {
    this.logoutOnClient();
    this.logoutOnServer();
    this.router.navigate(['/']);
  }

  private logoutOnClient(): void {
    this.isLoggedIn$.next(false);
    this.userRole$.next('');
    ['userEmail', 'userName', 'userId', 'clientId', 'clientName', 'sessionId'].forEach(key =>
      sessionStorage.removeItem(key)
    );
  }

  private async logoutOnServer(): Promise<void> {
    try {
      const result$ = this.http.post(`${this.apiUrl}/logout`, {}, {});
      await firstValueFrom(result$);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  public getUserEmail(): string | null {
    return sessionStorage.getItem('userEmail');
  }

  public getUserId(): string {
    return sessionStorage.getItem('userId')!;
  }

  public getSessionId(): string {
    return sessionStorage.getItem('sessionId')!;
  }
}
