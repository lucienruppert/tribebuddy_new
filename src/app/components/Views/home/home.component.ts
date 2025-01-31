import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
})
export class HomeComponent {
  constructor(private dialog: Dialog) {}

  public openLoginDialog(): void {
    this.dialog.open(LoginComponent);
  }
}
