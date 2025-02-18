import { Component } from '@angular/core';
import { GenekeysChartComponent } from '../../constellation/genekeys-chart/genekeys-chart.component';
import { WebsocketService } from '../../../../services/websocket.service';
import { AuthService } from '../../../../services/authentication.service';
import { SessionStartMessage } from '../../../../types-websocket';

@Component({
  selector: 'app-session-wrapper',
  imports: [GenekeysChartComponent],
  templateUrl: './session-wrapper.component.html',
  styleUrl: './session-wrapper.component.css',
})
export class SessionWrapperComponent {
  constructor(
    private wsService: WebsocketService,
    private authService: AuthService
  ) {
    const message: SessionStartMessage = {
      type: 'sessionStart',
      sessionType: 'constellation',
      constellation: 'geneKeys',
      email: this.authService.getUserEmail(),
      sessionId: this.authService.getSessionId(),
    };
    this.wsService.sendMessage(message);
    this.wsService.messages$.subscribe(message => {
      console.log('Received message:', message);
    });
  }
}
