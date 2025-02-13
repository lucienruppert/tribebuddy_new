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
  radius = 350;
  outerCircleLines = Array(52).fill(0); // 360 degrees / 7 degrees ≈ 52 lines
  Math = Math; // Make Math available in template
}
