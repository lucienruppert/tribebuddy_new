import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiCallResponse, UserProfile } from '../../../types';
import { SnackBarService } from '../../../services/snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UsersService } from '../../../services/user-data.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-detailed-user-profile',
  templateUrl: './detailed-user-profile.component.html',
  styleUrls: ['./detailed-user-profile.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CommonModule,
  ],
})
export class DetailedUserProfileComponent {
  public ages: number[] = Array.from({ length: 53 }, (_, i) => i + 18);
  public heights: number[] = Array.from({ length: 200 }, (_, i) => i + 150);
  public counties: string[] = [
    'Budapest',
    'Bács-Kiskun',
    'Baranya',
    'Békés',
    'Borsod-Abaúj-Zemplén',
    'Csongrád-Csanád',
    'Fejér',
    'Győr-Moson-Sopron',
    'Hajdú-Bihar',
    'Heves',
    'Jász-Nagykun-Szolnok',
    'Komárom-Esztergom',
    'Nógrád',
    'Pest',
    'Somogy',
    'Szabolcs-Szatmár-Bereg',
    'Tolna',
    'Vas',
    'Veszprém',
    'Zala',
  ];

  public formData: UserProfile = {
    email: sessionStorage.getItem(environment.EMAIL_KEY),
    nickname: '',
    age: '',
    height: '',
    aboutMe: '',
    build: '',
    languages: '',
    movies: '',
    music: '',
    books: '',
    foods: '',
    drinks: '',
    county: '',
    district: '',
  };
  public errorMessage = '';
  public showSpinner = false;

  constructor(
    public users: UsersService,
    private snackbar: SnackBarService
  ) {
    this.users.getUserProfile().then(user => {
      this.formData = {
        email: sessionStorage.getItem(environment.EMAIL_KEY),
        nickname: user.nickname,
        age: user.age,
        height: user.height,
        aboutMe: user.aboutMe,
        build: user.build,
        languages: user.languages,
        movies: user.movies,
        music: user.music,
        books: user.books,
        foods: user.foods,
        drinks: user.drinks,
        county: user.county,
        district: user.district,
      };
    });
  }

  public async submitForm(form: NgForm): Promise<void> {
    if (form.valid) {
      this.showSpinner = true;
      try {
        this.formData = form.value;
        this.formData.email = sessionStorage.getItem(environment.EMAIL_KEY);
        await this.users.storeProfile(this.formData);
        this.snackbar.showSnackBar('Adataid mentésre kerültek.');
      } catch (error: unknown) {
        if (error instanceof Object && 'status' in error) {
          this.errorMessage = (error as ApiCallResponse)['status'];
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        } else if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Ismeretlen hiba történt.';
        }
      }
      this.showSpinner = false;
    }
  }
}
