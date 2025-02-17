import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../../../services/websocket.service';
import { AuthService } from '../../../../services/authentication.service';

@Component({
  selector: 'app-genekeys-chart',
  templateUrl: './genekeys-chart.component.html',
  styleUrls: ['./genekeys-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GenekeysChartComponent {
  userEmail: string = '';

  constructor(
    private wsService: WebsocketService,
    private authService: AuthService
  ) {
    this.userEmail = this.authService.getUserEmail() || '';
    this.wsService.messages$.subscribe(message => {
      // Handle incoming messages here
    });
  }

  radius = 350;
  outerCircleLines = Array(72).fill(0);
  Math = Math; // Make Math available in template
}
