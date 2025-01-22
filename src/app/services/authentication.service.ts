import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private EMAIL_KEY: string = environment.EMAIL_KEY;
  private SEX_KEY: string = environment.SEX_KEY;
  private NAME_KEY: string = environment.NAME_KEY;
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
    const email = sessionStorage.getItem(this.EMAIL_KEY);
    const sex = sessionStorage.getItem(this.SEX_KEY);
    const name = sessionStorage.getItem(this.NAME_KEY);

    if (email && sex && name) {
      this.isLoggedIn$.next(true);
      // Since we don't store the role in session storage, defaulting to 'user'
      // You might want to add role to session storage as well
      this.userRole$.next('user');
    }
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const loginData = await this.loginUser(email, password);
      this.router.navigate(['/userprofile']);
      return loginData;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error['errors'])
        throw typedError.error['errors'].join(' ');
      return typedError.error['errors'];
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
    console.log(userData);

    // Get cookies from response headers
    const cookies = response.headers.getAll('Set-Cookie');
    if (cookies) {
      console.log('Received cookies:', cookies);
    }

    this.setBasicUserData(userData);
    return userData;
  }

  private setBasicUserData(userData: User): void {
    sessionStorage.setItem(this.EMAIL_KEY, userData.email!);
    sessionStorage.setItem(this.SEX_KEY, userData.sex!);
    sessionStorage.setItem(this.NAME_KEY, userData.name!);
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
    [this.EMAIL_KEY, this.SEX_KEY].forEach(key =>
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
    return sessionStorage.getItem(this.EMAIL_KEY);
  }

  public getUserSex(): string | null {
    return sessionStorage.getItem(this.SEX_KEY);
  }
}
