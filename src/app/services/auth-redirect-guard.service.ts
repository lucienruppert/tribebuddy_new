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
    const currentPath = this.router.url.split('?')[0];
    // Don't redirect if we're on a public route
    if (currentPath === '/genekeys-chart') {
      return true;
    }

    const isLoggedIn = !!this.auth.getUserEmail();
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
