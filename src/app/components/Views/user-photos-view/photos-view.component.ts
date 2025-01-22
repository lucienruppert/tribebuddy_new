import { SnackBarService } from "./../../../services/snackbar.service";
import { Component, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserPhotosService } from "../../../services/user-photos.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ApiCallResponse, PhotoData } from "../../../types";

@Component({
  selector: "app-photos-view",
  templateUrl: "./photos-view.component.html",
  styleUrls: ["./photos-view.component.css"],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
})
export class PhotosViewComponent implements OnDestroy {
  public photosData: PhotoData[] = [];
  private photoUpdateSubscription: Subscription;

  constructor(
    private photosService: UserPhotosService,
    private snackBar: SnackBarService
  ) {
    this.loadPhotosIntoComponent();
    this.photoUpdateSubscription = this.photosService
      .getPhotoUpdateListener()
      .subscribe(() => {
        this.loadPhotosIntoComponent();
        this.photosService.triggerProfileUpdate();
      });
  }

  private async loadPhotosIntoComponent() {
    const response = await this.photosService.getAllUserPhotos();
    if (!(response instanceof HttpErrorResponse)) {
      if (response.photosData && Array.isArray(response.photosData)) {
        this.photosData = response.photosData;
      } else {
        console.error("Invalid response format:", response);
        this.photosData = [];
      }
    } else {
      console.error("Error loading photos:", response);
      this.photosData = [];
    }
  }

  private isDeletable(fileName: string): boolean {
    const photo = this.photosData.find(
      (photoData) => photoData.fileName === fileName
    );
    return !(photo && photo.isProfile);
  }

  public async deletePhoto(photoUrl: string): Promise<ApiCallResponse> {
    const fileName = this.extractFileNameFromUrl(photoUrl);

    if (!this.isDeletable(fileName)) {
      this.snackBar.showSnackBar(
        "Törléshez másik képet kell beállítanod profilfotónak."
      );
      return {
        status: "Not applicable",
        message: "Profile photo cannot be deleted",
      };
    }

    try {
      const response = await this.photosService.deletePhoto(fileName);
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.photosService.triggerPhotoViewUpdate();
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }

  private extractFileNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf("/") + 1);
  }

  public async setProfilePhoto(photoData: PhotoData): Promise<ApiCallResponse> {
    if (photoData.isProfile)
      return {
        status: "Not applicable",
        message: "This photo is already set as profile photo.",
      };
    const fileName = this.extractFileNameFromUrl(photoData.fileName);
    try {
      const response = this.photosService.setToProfile(fileName);
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.photosService.triggerPhotoViewUpdate();
      // Removed triggerProfileUpdate since it's called in setToProfile
      return response;
    } catch (error: unknown) {
      const typedError = error as HttpErrorResponse;
      if (typedError.error) throw typedError.error;
      return typedError.error;
    }
  }

  onImageLoad(photoData: PhotoData) {
    photoData.isLoaded = true;
  }

  ngOnDestroy() {
    this.photoUpdateSubscription.unsubscribe();
  }
}
