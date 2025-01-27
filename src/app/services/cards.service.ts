import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { Card } from '../types';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {}

  public async getCards(): Promise<Card[]> {
    try {
      const result$ = this.http.get<Card[]>(`${this.apiUrl}/cards`);
      const response = await firstValueFrom(result$);
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }
}
