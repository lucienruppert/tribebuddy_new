import { User } from './../types';
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  constructor(private http: HttpClient) {}

  public async sendRegistrationConfirmation(User: User): Promise<HttpErrorResponse> { 
    const to = User.email;
    const from = 'Tribebuddy <noreply@tribebuddy.hu>';
    const subject = "Regisztrációd visszaigazolása";
    const body = "Köszönjük regisztrációdat!";
    try {
      const result$ = this.http.post<HttpErrorResponse>(
        `${environment.mailUrl}/confirmation`,
        { to, from, subject, body }
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
