import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Session, ApiCallResponse, GeneKeysData } from '../types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(
    private http: HttpClient,
  ) {}

  getClientsByEmail(email: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.apiUrl}/clients/${email}`);
  }

  storeConstellationSession(session: Session): Observable<ApiCallResponse> {
    return this.http.post<ApiCallResponse>(
      `${environment.apiUrl}/clients/session/store`,
      session
    );
  }

  getClientName(): string {
    return sessionStorage.getItem('clientName') || '';
  }

  getClientId(): number {
    return Number(sessionStorage.getItem('clientId')) || 0;
  }

  storeGeneKeys(geneKeysData: {
    [key: string]: number;
  }): Observable<ApiCallResponse> {
    return this.http.post<ApiCallResponse>(
      `${environment.apiUrl}/clients/genekeys/store`,
      {
        id: Number(this.getClientId()),
        ...geneKeysData,
      }
    );
  }
}
