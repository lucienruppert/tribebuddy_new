import { UsersService } from '../../services/user-data.service';
import { Dialog } from '@angular/cdk/dialog';
import { RegistrationComponent } from '../registration/registration.component';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserPhotosService } from '../../services/user-photos.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    RouterModule,
  ],
})
export class NavigationComponent implements OnDestroy {
  public isLoggedIn = false;
  private destroy$ = new Subject<void>();
  public isContentReady = false;
  public profilePhoto: string | null = null;

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private dialog: Dialog,
  ) {
    this.authentication.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
      });
  }

  // async ngOnInit() {
  //   if (this.authentication.isLoggedIn$.value) {
  //     this.loadProfilePhoto();
  //   }
  //   setTimeout(() => {
  //     this.isContentReady = true;
  //   }, 200);
  // }

  // private async loadProfilePhoto(): Promise<void> {
  //   try {
  //     const photo = await this.photosService.getProfilePhoto();
  //     this.profilePhoto = photo;
  //   } catch (error) {
  //     console.error('Error loading profile photo:', error);
  //     this.profilePhoto = null;
  //   }
  // }

  public openRegistrationDialog(): void {
    this.dialog.open(RegistrationComponent);
  }

  public openLoginDialog(): void {
    this.dialog.open(LoginComponent);
  }

  public logout(): void {
    this.authentication.logout();
  }

  public navigateTo(route: string): void {
    this.router.navigate([`/tribebuddy/${route}`]);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
