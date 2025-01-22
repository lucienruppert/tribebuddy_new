import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
import { ApiCallResponse, PhotoUploadResponse } from "../../../types";
import { SnackBarService } from "../../../services/snackbar.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { UserPhotosService } from "../../../services/user-photos.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-photo-upload",
  templateUrl: "./photo-upload.component.html",
  styleUrls: ["./photo-upload.component.css"],
  standalone: true,
  imports: [MatSnackBarModule, MatProgressBarModule, CommonModule],
})
export class PhotoUploadComponent {
  public selectedFile: File | null = null;
  public fileName = "Fájlnév";
  public email: string = sessionStorage.getItem(environment.EMAIL_KEY)!;
  public isUploading = false;
  public uploadProgress = 0;

  constructor(
    private snackbar: SnackBarService,
    private photosService: UserPhotosService
  ) {}

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.fileName = input.files[0].name;
    }
  }

  public async onSubmit(): Promise<void> {
    if (!this.selectedFile) {
      this.snackbar.showSnackBar("Válassz egy fotót!");
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append("file", this.selectedFile);

    try {
      const result$ = await this.photosService.uploadPhoto(formData);

      result$.subscribe(async (event: HttpEvent<unknown>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress: {
            if (event.total) {
              this.uploadProgress = Math.round(
                (100 * event.loaded) / event.total
              );
            }
            break;
          }
          case HttpEventType.Response: {
            const response = event.body as PhotoUploadResponse;
            try {
              const storingResponse = await this.storeUploadedPhotoData(
                this.email,
                response.fileName
              );

              if (storingResponse.status === "error") {
                this.snackbar.showSnackBar(storingResponse.message);
                return;
              }

              if (storingResponse.message) {
                this.snackbar.showSnackBar(storingResponse.message);
              }
              if (response && response.message) {
                this.snackbar.showSnackBar(response.message);
              }
            } catch (error: unknown) {
              const typedError = error as {
                message?: string;
                error?: { message: string };
              };
              const errorMessage =
                typedError.message ||
                typedError.error?.message ||
                "Error storing photo data";
              this.snackbar.showSnackBar(errorMessage);
            } finally {
              this.fileName = "Fájlnév";
              this.photosService.triggerPhotoViewUpdate();
              this.isUploading = false;
              this.uploadProgress = 0;
            }
            break;
          }
        }
      });
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      this.snackbar.showSnackBar(typedError.error);
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  public onFileSelectedAndSubmit(event: Event): void {
    this.onFileSelected(event);
    this.onSubmit();
  }

  private async storeUploadedPhotoData(
    email: string,
    fileName: string
  ): Promise<ApiCallResponse> {
    return await this.photosService.storePhotoData(email, fileName);
  }
}
