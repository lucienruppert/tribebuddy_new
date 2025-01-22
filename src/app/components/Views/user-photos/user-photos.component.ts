import { Component } from '@angular/core';
import { PhotosViewComponent } from '../user-photos-view/photos-view.component';
import { PhotoUploadComponent } from '../user-photos-upload/photo-upload.component';

@Component({
  selector: 'app-user-photos',
  templateUrl: './user-photos.component.html',
  styleUrls: ['./user-photos.component.css'],
  standalone: true,
  imports: [PhotosViewComponent, PhotoUploadComponent]
})
export class UserPhotosComponent {


}
