import { Dialog } from '@angular/cdk/dialog';
import { RegistrationComponent } from '../registration/registration.component';
import { AuthService } from '../../services/authentication.service';
import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
    private authentication: AuthService,
    private router: Router,
    private dialog: Dialog
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
