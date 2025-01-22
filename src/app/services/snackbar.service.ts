import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private readonly SNACKBAR_DURATION = 2000;

  constructor(private snackBar: MatSnackBar) {}

  public showSnackBar(message: string): void {
    this.snackBar.open(message, "", {
      duration: this.SNACKBAR_DURATION,
      verticalPosition: "top"
    });
  }
}
