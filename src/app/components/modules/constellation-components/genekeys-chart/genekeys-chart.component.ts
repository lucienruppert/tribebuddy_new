import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ring {
  radius: number;
  color: string;
  numbers: number[];
}

interface Point {
  x: number;
  y: number;
  number: number;
  label: string;
}

@Component({
  selector: 'app-genekeys-chart',
  templateUrl: './genekeys-chart.component.html',
  styleUrls: ['./genekeys-chart.component.css'],
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenekeysChartComponent implements OnInit {
  rings: Ring[] = [
    {
      radius: 180,
      color: '#FFE5CC',
      numbers: Array.from({ length: 64 }, (_, i) => i + 1),
    },
    {
      radius: 150,
      color: '#FFD1B3',
      numbers: Array.from({ length: 64 }, (_, i) => i + 1),
    },
    {
      radius: 120,
      color: '#FFBE99',
      numbers: Array.from({ length: 64 }, (_, i) => i + 1),
    },
  ];

  radius = 160;
  points: Point[] = [];
  connections: [number, number][] = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 1],
  ];

  private readonly positions = [
    { angle: 270, label: "Life's Work", distance: 1 }, // 1 - top
    { angle: 315, label: 'Evolution', distance: 1 }, // 2 - top right
    { angle: 0, label: 'Radiance', distance: 0.8 }, // 3 - right top
    { angle: 45, label: 'Purpose', distance: 1 }, // 4 - right
    { angle: 90, label: 'Brand', distance: 0.8 }, // 5 - right bottom
    { angle: 135, label: 'Culture', distance: 1 }, // 6 - bottom right
    { angle: 180, label: 'Vocation', distance: 1 }, // 7 - bottom
    { angle: 225, label: 'Career', distance: 1 }, // 8 - bottom left
    { angle: 270, label: 'Pearl', distance: 0.6 }, // 9 - center top
    { angle: 225, label: 'Prosperity', distance: 0.4 }, // 10 - center
    { angle: 270, label: 'Genesis', distance: 0.2 }, // 11 - center
  ];

  constructor() {}

  ngOnInit(): void {
    this.calculatePoints();
  }

  private calculatePoints(): void {
    this.points = this.positions.map((pos, i) => {
      const angleInRadians = (pos.angle * Math.PI) / 180;
      return {
        x: this.radius * pos.distance * Math.cos(angleInRadians),
        y: this.radius * pos.distance * Math.sin(angleInRadians),
        number: i + 1,
        label: pos.label,
      };
    });
  }

  getPointPosition(index: number): Point {
    return this.points[index] || { x: 0, y: 0, number: 0, label: '' };
  }

  getTextPosition(
    radius: number,
    index: number,
    total: number = 64
  ): { x: number; y: number } {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: (radius - 15) * Math.cos(angle),
      y: (radius - 15) * Math.sin(angle),
    };
  }

  getTextRotation(index: number, total: number = 64): number {
    return (index * 360) / total + 90;
  }
}
