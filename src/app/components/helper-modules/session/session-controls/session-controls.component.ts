import { ClientsService } from './../../../../services/clients.service';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from './../../../../services/authentication.service';
import { Component } from '@angular/core';
import { WebsocketService } from './../../../../services/websocket.service';
import { SessionEndMessage } from '../../../../types-websocket';
import { Router } from '@angular/router';
import { geneKeyTranslations } from '../../../../translations';

interface ClientCard {
  sphereName: string;
  cardNumber: number;
}

@Component({
  selector: 'app-session-controls',
  imports: [NgIf, CommonModule],
  templateUrl: './session-controls.component.html',
  styleUrl: './session-controls.component.css',
  standalone: true,
})
export class SessionControlsComponent {
  clientGenekeys: { [key: string]: number } = {};
  isFullscreen = false;

  constructor(
    private wsService: WebsocketService,
    public authService: AuthService,
    private router: Router,
    private clientsService: ClientsService
  ) {
    this.clientGenekeys = this.clientsService.clientGenekeys;
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

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
    this.router.navigate(['dashboard']);
  }

  get clientCards(): ClientCard[] {
    return Object.entries(this.clientGenekeys)
      .filter(([key]) => key !== 'clientId')
      .map(([sphereName, cardNumber]) => ({
        sphereName: geneKeyTranslations[sphereName] || sphereName,
        cardNumber,
      }));
  }
}
