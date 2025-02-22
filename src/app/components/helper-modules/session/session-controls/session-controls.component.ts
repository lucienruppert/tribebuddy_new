import { NgIf } from '@angular/common';
import { AuthService } from './../../../../services/authentication.service';
import { Component } from '@angular/core';
import { WebsocketService } from './../../../../services/websocket.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-controls',
  imports: [NgIf],
  templateUrl: './session-controls.component.html',
  styleUrl: './session-controls.component.css',
  standalone: true,
})
export class SessionControlsComponent {
  constructor(
    private wsService: WebsocketService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  endSession(): void {
    console.log('Ending session');
  }
}
