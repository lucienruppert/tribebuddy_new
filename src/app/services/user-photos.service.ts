import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { firstValueFrom, Observable, Subject, debounceTime } from 'rxjs';
import {
  ApiCallResponse,
  PhotosRequestResult,
  PhotoUploadResponse,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class UserPhotosService {
  private apiUrl: string = environment.apiUrl;
  private photoUpdateSubject = new Subject<void>();
  private profileUpdateSubject = new Subject<string>();
  private profileUpdateDebounced = this.profileUpdateSubject.pipe(
    debounceTime(300)
  );

  constructor(private http: HttpClient) {}

  private getEmail(): string | null {
    return sessionStorage.getItem(environment.EMAIL_KEY);
  }

  public async uploadPhoto(
    photo: FormData
  ): Promise<Observable<HttpEvent<PhotoUploadResponse>>> {
    return this.http.post<PhotoUploadResponse>(
      `${this.apiUrl}/photos/upload`,
      photo,
      { reportProgress: true, observe: 'events' }
    );
  }

  public async storePhotoData(
    email: string,
    fileName: string
  ): Promise<ApiCallResponse> {
    try {
      const result$ = this.http.post<ApiCallResponse>(
        `${this.apiUrl}/photos/store`,
        {
          email,
          fileName,
        }
      );
      return await firstValueFrom(result$);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.error) {
        return error.error;
      }
      throw error;
    }
  }

  public async deletePhoto(fileName: string): Promise<ApiCallResponse> {
    const result$ = this.http.post<ApiCallResponse>(
      `${this.apiUrl}/photos/delete`,
      { fileName }
    );
    // const result$ = this.http.delete<ApiCallResponse>(
    //   `${this.baseUrl}/photos/deletethis/${fileName}`
    // );
    return await firstValueFrom(result$);
  }

  public async setToProfile(fileName: string): Promise<ApiCallResponse> {
    const email = this.getEmail();
    if (!email) return { status: 'error', message: 'No email found' };

    const result$ = this.http.post<ApiCallResponse>(
      `${this.apiUrl}/photos/setprofile`,
      { fileName, email }
    );
    const response = await firstValueFrom(result$);
    this.triggerProfileUpdate();
    return response;
  }

  public async getAllUserPhotos(): Promise<
    PhotosRequestResult | HttpErrorResponse
  > {
    const email = this.getEmail();
    if (!email)
      return new HttpErrorResponse({
        error: { status: 'error', message: 'No email found' },
      });
    try {
      const result$ = this.http.post<PhotosRequestResult | HttpErrorResponse>(
        `${this.apiUrl}/photos/list`,
        { email }
      );
      const response = await firstValueFrom(result$);
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }

  public async extractProfilePhoto(): Promise<string | null> {
    try {
      const response = await this.getAllUserPhotos();
      if (!(response instanceof HttpErrorResponse) && response.photosData) {
        const profilePhoto = response.photosData.find(photo => photo.isProfile);
        return profilePhoto ? profilePhoto.fileName : null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null;
    }
  }

  public async getProfilePhoto(): Promise<string | null> {
    const email = this.getEmail();
    if (!email) return null;

    try {
      const result$ = this.http.post<{ fileName: string }>(
        `${this.apiUrl}/photos/getprofile`,
        { email }
      );
      const response = await firstValueFrom(result$);
      return response.fileName;
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null;
    }
  }

  public triggerProfileUpdate() {
    this.extractProfilePhoto().then(profilePhoto => {
      this.profileUpdateSubject.next(profilePhoto || '');
    });
  }

  public getProfileUpdateListener() {
    return this.profileUpdateDebounced;
  }

  public triggerPhotoViewUpdate() {
    this.photoUpdateSubject.next();
  }

  public getPhotoUpdateListener() {
    return this.photoUpdateSubject.asObservable();
  }
}
