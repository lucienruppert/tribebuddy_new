import { NgIf } from '@angular/common';
import { AuthService } from './../../../../services/authentication.service';
import { Component } from '@angular/core';
import { WebsocketService } from './../../../../services/websocket.service';
import { ActivatedRoute } from '@angular/router';
import { SessionEndMessage } from '../../../../types-websocket';

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
    public authService: AuthService,  // Changed from private to public
    private route: ActivatedRoute
  ) {}

  endSession(): void {
    console.log('Ending session');
    const message: SessionEndMessage = {
      type: 'sessionEnd',
      email: this.authService.getUserEmail(),
    };
    this.wsService.sendMessage(message);
    this.wsService.messages$.subscribe(message => {
      console.log('Received message:', message);
    });
  }
}
