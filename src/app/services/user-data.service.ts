import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { User, UserProfile } from '../types';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl: string = environment.apiUrl;
  private NAME_KEY: string = environment.NAME_KEY;
  private SEX_KEY: string = environment.SEX_KEY;
  private EMAIL_KEY: string = environment.EMAIL_KEY;
  public userName$ = new BehaviorSubject<string | null>(
    sessionStorage.getItem(this.NAME_KEY)
  );
  public userSex$ = new BehaviorSubject<string | null>(
    sessionStorage.getItem(this.SEX_KEY)
  );

  constructor(private http: HttpClient) {}

  public async getUserProfile(): Promise<UserProfile> {
    try {
      const result$ = this.http.post<UserProfile>(
        `${this.apiUrl}/userprofile/get`,
        { email: sessionStorage.getItem(this.EMAIL_KEY) }
      );
      const response = await firstValueFrom(result$);
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }

  public async storeProfile(formObject: UserProfile): Promise<User> {
    try {
      const result$ = this.http.post<User>(
        `${this.apiUrl}/userprofile/store`,
        formObject
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
