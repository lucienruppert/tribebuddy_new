import { ClientsService } from './../../../../services/clients.service';
import { NgIf, CommonModule } from '@angular/common';
import { AuthService } from './../../../../services/authentication.service';
import { Component } from '@angular/core';
import { WebsocketService } from './../../../../services/websocket.service';
import { SessionEndMessage, UpdateOnChartMessage } from '../../../../types-websocket';
import { Router } from '@angular/router';
import { geneKeyTranslations } from '../../../../translations';
import { DataSharingService } from '../../../../services/data-sharing.service';
import { onChart } from '../../../../types';

interface ClientCard {
  sphereName: string; // Original English name
  displayName: string; // Translated Hungarian name
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
  onChart: onChart = {};

  constructor(
    private wsService: WebsocketService,
    public authService: AuthService,
    private router: Router,
    private clientsService: ClientsService,
    private dataSharingService: DataSharingService
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

  toggleCard(cardNumber: number, sphereName: string): void {
    const newOnChart = { ...this.onChart };

    if (newOnChart[sphereName]) {
      delete newOnChart[sphereName];
    } else {
      newOnChart[sphereName] = cardNumber;
    }

    this.onChart = newOnChart;
    this.dataSharingService.updateOnChart(newOnChart);

    const message: UpdateOnChartMessage = {
      type: 'updateOnChart',
      onChart: this.onChart,
      sessionId: this.authService.getUserId(),
    };
    this.wsService.sendMessage(message);
  }

  isCardSelected(cardNumber: number, sphereName: string): boolean {
    return this.onChart[sphereName] === cardNumber;
  }

  get clientCards(): ClientCard[] {
    return Object.entries(this.clientGenekeys)
      .filter(([key]) => key !== 'clientId')
      .map(([sphereName, cardNumber]) => ({
        sphereName, // Original name for data operations
        displayName: geneKeyTranslations[sphereName] || sphereName, // Translated name for display
        cardNumber,
      }));
  }
}
