import { Component } from '@angular/core';
import { GenekeysChartComponent } from '../../constellation/genekeys-chart/genekeys-chart.component';
import { WebsocketService } from '../../../../services/websocket.service';
import { AuthService } from '../../../../services/authentication.service';
import { SessionStartMessage } from '../../../../types-websocket';
import { SessionControlsComponent } from '../session-controls/session-controls.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-session-wrapper',
  imports: [GenekeysChartComponent, SessionControlsComponent],
  templateUrl: './session-wrapper.component.html',
  styleUrl: './session-wrapper.component.css',
})
export class SessionWrapperComponent {
  sessionId: number;

  constructor(
    private wsService: WebsocketService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.sessionId = parseInt(this.route.snapshot.params['sessionId']);
    const message: SessionStartMessage = {
      type: 'sessionStart',
      sessionType: 'constellation',
      constellation: 'geneKeys',
      email: this.authService.getUserEmail(),
      sessionId: this.sessionId.toString(),
    };
    this.wsService.sendMessage(message);
    this.wsService.messages$.subscribe(message => {
      console.log('Received message:', message);
    });
  }
}
