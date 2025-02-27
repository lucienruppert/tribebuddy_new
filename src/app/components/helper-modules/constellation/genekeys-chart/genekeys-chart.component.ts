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
  constructor(private DataSharingService: DataSharingService) {
    this.DataSharingService.onChart$.subscribe((onChart) => {
      this.onChart = onChart;
      console.log(this.onChart);
    });
  }
  onChart: onChart = {};
  radius = 350;
  outerCircleLines = Array(72).fill(0);
  Math = Math;
  @Input() sessionId!: string;
}
