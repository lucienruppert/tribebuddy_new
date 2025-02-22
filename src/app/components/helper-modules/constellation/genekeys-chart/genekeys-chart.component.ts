import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genekeys-chart',
  templateUrl: './genekeys-chart.component.html',
  styleUrls: ['./genekeys-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class GenekeysChartComponent implements OnInit {
  radius = 350;
  outerCircleLines = Array(72).fill(0);
  Math = Math;
  @Input() sessionId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    console.log('GeneKeys Chart SessionID:', this.sessionId);
  }
}
