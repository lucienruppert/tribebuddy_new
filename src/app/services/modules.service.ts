import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserModule } from '../types';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  public async getModules(): Promise<UserModule[]> {
    try {
      const email = this.authService.getUserEmail();
      if (!email) throw new Error('User not logged in');

      const result$ = this.http.get<UserModule[]>(
        `${this.apiUrl}/modules/${email}`
      );
      const response = await firstValueFrom(result$);
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }
}
