import { Injectable } from '@angular/core';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(private auth: AuthService) {}

  public canActivate(): boolean {
    return !!this.auth.getUserEmail();
  }
}
