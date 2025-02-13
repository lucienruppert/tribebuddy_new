import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogRef } from '@angular/cdk/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../../services/email.service';
import { RegistrationService } from '../../../services/registration.service';
import { SnackBarService } from '../../../services/snackbar.service';
import { User } from '../../../types';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatProgressSpinnerModule,
    NgIf,
    MatSnackBarModule,
    CommonModule,
    RouterModule,
  ],
})
export class RegistrationComponent implements OnInit {
  public formData: User = {
    name: '',
    email: '',
    password: '',
  };
  public acceptTerms = false;
  public errorMessage = '';
  public showSpinner = false;
  public isDialogReady = false;

  get isSubmitDisabled(): boolean {
    return (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.password ||
      !this.acceptTerms
    );
  }

  constructor(
    public dialogRef: DialogRef,
    public registration: RegistrationService,
    public email: EmailService,
    private snackbar: SnackBarService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isDialogReady = true;
    }, 200);
  }

  public async submitForm(form: NgForm): Promise<void> {
    if (form.valid) {
      this.showSpinner = true;
      try {
        await this.registration.register(this.formData);
        this.snackbar.showMessage('Regisztrációd sikeres.');
        this.dialogRef.close();
        // Fire and forget email confirmation
        this.email
          .sendRegistrationConfirmation(this.formData)
          .catch(error =>
            console.error('Failed to send confirmation email:', error)
          );
      } catch (error: unknown) {
        console.error('Registration error:', error);
        if (error && typeof error === 'object') {
          if ('status' in error) {
            this.errorMessage = (error as { status: string }).status;
          } else if ('error' in error) {
            this.errorMessage = (error as { error: string }).error;
          } else if (error instanceof Error) {
            this.errorMessage = error.message;
          }
        } else if (typeof error === 'string') {
          this.errorMessage = error;
        } else {
          this.errorMessage =
            'Sikertelen regisztráció. Kérjük próbáld újra később.';
        }
      }
      this.showSpinner = false;
    }
  }
}
