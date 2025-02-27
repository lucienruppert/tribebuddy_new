import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenekeysChartComponent } from '../../constellation/genekeys-chart/genekeys-chart.component';
import { WebsocketService } from '../../../../services/websocket.service';
import { AuthService } from '../../../../services/authentication.service';
import {
  SessionStartMessage,
  HeartbeatMessage,
} from '../../../../types-websocket';
import { SessionControlsComponent } from '../session-controls/session-controls.component';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-session-wrapper',
  imports: [CommonModule, GenekeysChartComponent, SessionControlsComponent],
  templateUrl: './session-wrapper.component.html',
  styleUrl: './session-wrapper.component.css',
  standalone: true,
})
export class SessionWrapperComponent {
  sessionId: string;
  isSessionValid = true;

  constructor(
    private wsService: WebsocketService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router
  ) {
    this.sessionId = this.route.snapshot.params['sessionId'];

    if (!this.authService.isLoggedIn$.value) {
      this.wsService.messages$
        .pipe(filter(msg => msg.type === 'heartbeat'))
        .subscribe((message: HeartbeatMessage) => {
          this.isSessionValid = message.sessionIds.includes(
            this.sessionId
          );

          if (!this.isSessionValid) {
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 5000);
          }
        });
    }

    const message: SessionStartMessage = {
      type: 'sessionStart',
      sessionType: 'constellation',
      constellation: 'geneKeys',
      email: this.authService.getUserEmail(),
      sessionId: this.sessionId,
    };
    this.wsService.sendMessage(message);
  }
}
