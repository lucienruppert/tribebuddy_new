import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class PublicRouteGuard {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    return true;
  }
}
