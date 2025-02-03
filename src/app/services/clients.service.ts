import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../types';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  getClientsByEmail(email: string): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${environment.apiUrl}/clients/${email}`
    );
  }
}
