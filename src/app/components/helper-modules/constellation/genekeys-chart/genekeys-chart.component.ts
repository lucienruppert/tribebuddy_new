import { DataSharingService } from './../../../../services/data-sharing.service';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { onChart } from '../../../../types';

@Component({
  selector: 'app-genekeys-chart',
  templateUrl: './genekeys-chart.component.html',
  styleUrls: ['./genekeys-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GenekeysChartComponent {
  private nameMapping: {[key: string]: string} = {
    'lifesWork': 'Tennivalód az életben',
    'evolution': 'Fejlődésed útja',
    'radiance': 'Ragyogásod',
    'purpose': 'Életcélod',
    'pearl': 'Gyöngy',
    'attraction': 'Vonzásmeződ',
    'eq': 'EQ',
    'iq': 'IQ',
    'culture': 'Kultúra',
    'vocation': 'Mag/Hivatás',
    'sq': 'SQ'
  };

  constructor(private dataSharingService: DataSharingService) {
    this.dataSharingService.onChart$.subscribe(onChart => {
      this.onChart = Object.entries(onChart).reduce((acc, [key, value]) => {
        acc[this.nameMapping[key]] = value;
        return acc;
      }, {} as onChart);
      this.renderCards();
      console.log('Translated onChart:', this.onChart);
    });
  }

  renderCards() {
    console.log('Rendering cards with positions:', this.cardPositions);
    console.log('Current onChart state:', this.onChart);
  }

  onChart: onChart = {};
  radius = 350;
  outerCircleLines = Array(72).fill(0);
  Math = Math;
  @Input() sessionId!: string;

  cardPositions = [
    { name: 'SQ', x: 360, y: 345 },
    { name: 'Fejlődésed útja', x: 400 + 350 - 40, y: 346 },
    { name: 'Ragyogásod', x: 400 - 350 - 40, y: 346 },
    { name: 'Tennivalód az életben', x: 360, y: 400 - 350 - 40 },
    { name: 'Életcélod', x: 360, y: 400 + 350 - 68 },
    { name: 'Gyöngy', x: 360, y: 400 - 350 * 0.5 - 54 },
    { name: 'Vonzásmeződ', x: 360, y: 400 + 350 * 0.5 - 54 },
    {
      name: 'EQ',
      x: 400 + 350 * 0.5 * 0.866 - 40,
      y: 400 + 350 * 0.5 * 0.5 - 54,
    },
    {
      name: 'IQ',
      x: 400 - 350 * 0.5 * 0.866 - 40,
      y: 400 + 350 * 0.5 * 0.5 - 54,
    },
    {
      name: 'Kultúra',
      x: 400 + 350 * 0.5 * 0.866 - 40,
      y: 400 - 350 * 0.5 * 0.5 - 54,
    },
    {
      name: 'Mag/Hivatás',
      x: 400 - 350 * 0.5 * 0.866 - 40,
      y: 400 - 350 * 0.5 * 0.5 - 54,
    },
  ];
}
