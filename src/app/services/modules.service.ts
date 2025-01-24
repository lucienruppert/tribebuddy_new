import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Module, UserProfile } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public async getModules(): Promise<Module[]> {
    try {
      const result$ = this.http.get<Module[]>(`${this.apiUrl}/modules`);
      const response = await firstValueFrom(result$);
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }
}
