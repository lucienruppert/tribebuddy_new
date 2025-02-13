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
  outerCircleLines = Array(48).fill(0); // Creates array of 48 elements for the outer circle lines
  Math = Math; // Make Math available in template
}
