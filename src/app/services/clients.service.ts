import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Session, ApiCallResponse } from '../types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  clientGenekeys: { [key: string]: number } = {};
  constructor(private http: HttpClient) {}

  getClientsByEmail(email: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.apiUrl}/clients/${email}`);
  }

  storeConstellationSession(session: Session): Observable<ApiCallResponse> {
    return this.http.post<ApiCallResponse>(
      `${environment.apiUrl}/clients/session/store`,
      session
    );
  }

  setClientName(clientName: string): void {
    sessionStorage.setItem('clientName', clientName);
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
    this.clientGenekeys = geneKeysData;
    console.log('NEW geneKeysData', geneKeysData);
    return this.http.post<ApiCallResponse>(
      `${environment.apiUrl}/clients/genekeys/store`,
      {
        id: Number(this.getClientId()),
        ...geneKeysData,
      }
    );
  }

  getGenekeysById(clientId: number): Observable<{ [key: string]: number }> {
    const response = this.http.get<{ [key: string]: number }>(
      `${environment.apiUrl}/clients/genekeys/get/${clientId}`
    );
    response.subscribe(data => {
      this.clientGenekeys = data;
    });
    return response;
  }
}
