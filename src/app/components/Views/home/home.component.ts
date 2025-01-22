import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { RegistrationComponent } from '../../registration/registration.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private dialog: Dialog) {}

  public openRegistrationDialog(): void {
    this.dialog.open(RegistrationComponent);
  }
}
