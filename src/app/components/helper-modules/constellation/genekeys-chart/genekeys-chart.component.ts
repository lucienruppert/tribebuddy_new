import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onChart } from '../../../../types';
import { WebsocketService } from '../../../../services/websocket.service';
import { Subscription } from 'rxjs';
import {
  OnChartUpdateForwardMessage
} from '../../../../types-websocket';

@Component({
  selector: 'app-genekeys-chart',
  templateUrl: './genekeys-chart.component.html',
  styleUrls: ['./genekeys-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GenekeysChartComponent implements OnInit, OnDestroy {
  private nameMapping: { [key: string]: string } = {
    lifesWork: 'Tennivalód az életben',
    evolution: 'Fejlődésed útja',
    radiance: 'Ragyogásod',
    purpose: 'Életcélod',
    pearl: 'Gyöngy',
    attraction: 'Vonzásmeződ',
    eq: 'EQ',
    iq: 'IQ',
    culture: 'Kultúra',
    vocation: 'Mag/Hivatás',
    sq: 'SQ',
  };

  private wsSubscription: Subscription | null = null;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.wsSubscription = this.websocketService
      .getMessages()
      .subscribe(message => {
        if (
          message &&
          typeof message === 'object' &&
          'type' in message &&
          message.type === 'onChartUpdateForward' &&
          'onChart' in message
        ) {
          const updateMessage = message as OnChartUpdateForwardMessage;
          console.log('Received updateOnChart message:', updateMessage);

          // Transform the onChart data with name mapping
          this.onChart = Object.entries(updateMessage.onChart).reduce(
            (acc, [key, value]) => {
              acc[this.nameMapping[key]] = value;
              return acc;
            },
            {} as onChart
          );
        }
      });
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
  }

  onChart: onChart = {};
  radius = 350;
  outerCircleLines = Array(72).fill(0);
  Math = Math;
  @Input() sessionId!: string;

  cardPositions = [
    { name: 'SQ', x: 360 - 10, y: 345 - 13, width: 92, height: 125 },
    {
      name: 'Fejlődésed útja',
      x: 400 + 350 - 53, // Moved additional 5px right
      y: 346 - 13,
      width: 92,
      height: 125,
    },
    {
      name: 'Ragyogásod',
      x: 400 - 350 - 53, // Moved 5px right
      y: 346 - 13,
      width: 92,
      height: 125,
    },
    {
      name: 'Tennivalód az életben',
      x: 360 - 10,
      y: 400 - 350 - 51, 
      width: 92,
      height: 125,
    },
    {
      name: 'Életcélod',
      x: 360 - 10,
      y: 400 + 350 - 80,
      width: 92,
      height: 125,
    },
    {
      name: 'Gyöngy',
      x: 360 - 10,
      y: 400 - 350 * 0.5 - 78,
      width: 92,
      height: 125,
    },
    {
      name: 'Vonzásmeződ',
      x: 360 - 10,
      y: 400 + 350 * 0.5 - 78,
      width: 92,
      height: 125,
    },
    {
      name: 'EQ',
      x: 400 + 350 * 0.5 * 0.866 - 53, 
      y: 400 + 350 * 0.5 * 0.5 - 78,
      width: 92,
      height: 125,
    },
    {
      name: 'IQ',
      x: 400 - 350 * 0.5 * 0.866 - 53, 
      y: 400 + 350 * 0.5 * 0.5 - 78,
      width: 92,
      height: 125,
    },
    {
      name: 'Kultúra',
      x: 400 + 350 * 0.5 * 0.866 - 53, 
      y: 400 - 350 * 0.5 * 0.5 - 78,
      width: 92,
      height: 125,
    },
    {
      name: 'Mag/Hivatás',
      x: 400 - 350 * 0.5 * 0.866 - 53,
      y: 400 - 350 * 0.5 * 0.5 - 78,
      width: 92,
      height: 125,
    },
  ];

  getCardStyle(
    position: any,
    cardElement: HTMLElement
  ): { [key: string]: string } {
    const actualWidth = cardElement.offsetWidth;
    const actualHeight = cardElement.offsetHeight;

    // Calculate centering offsets
    const xOffset = (position.width - actualWidth) / 2;
    const yOffset = (position.height - actualHeight) / 2;

    return {
      position: 'absolute',
      left: `${position.x + xOffset}px`,
      top: `${position.y + yOffset}px`,
      width: 'auto',
      height: 'auto',
    };
  }
}
