import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genekeys-chart',
  templateUrl: './genekeys-chart.component.html',
  styleUrls: ['./genekeys-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GenekeysChartComponent {
  radius = 150; // Circle radius in pixels
}
