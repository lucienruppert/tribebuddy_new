import { Component } from '@angular/core';
import { GenekeysChartComponent } from '../../constellation/genekeys-chart/genekeys-chart.component';
import { WebsocketService } from '../../../../services/websocket.service';
import { AuthService } from '../../../../services/authentication.service';

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
    this.wsService.sendMessage({
      type: 'sessionStart',
      sessionType: 'constellation',
      constellation: 'geneKeys',
      email: this.authService.getUserEmail() || '',
    });
    this.wsService.messages$.subscribe(message => {
      console.log('Received message:', message);
    });
  }
}
