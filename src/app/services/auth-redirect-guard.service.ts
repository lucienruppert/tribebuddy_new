import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  public canActivate(): boolean {
    const isLoggedIn = !!this.auth.getUserEmail();
    if (!isLoggedIn) {
      this.router.navigate(['/']); // Redirect to home if not logged in
      return false;
    }
    return true;
  }

  public redirectBasedOnAuth(): boolean {
    const isLoggedIn = !!this.auth.getUserEmail();
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
