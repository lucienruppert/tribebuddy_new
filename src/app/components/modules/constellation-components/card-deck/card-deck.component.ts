import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-deck.component.html',
})
export class CardDeckComponent {
  cards: number[] = [];

  constructor() {
    this.cards = Array.from({ length: 64 }, (_, i) => i + 1);
  }
}
