import { NgIf } from '@angular/common';
import { AuthService } from './../../../../services/authentication.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-session-controls',
  imports: [NgIf],
  templateUrl: './session-controls.component.html',
  styleUrl: './session-controls.component.css',
  standalone: true,
})
export class SessionControlsComponent {
  constructor(public authService: AuthService) { }
  
  endSession(): void {
    console.log('Ending session');
  }
}
