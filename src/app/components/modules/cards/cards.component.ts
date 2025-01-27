import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../../services/cards.service';
import { Card } from '../../../types';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  cards: Card[] = [];

  constructor(private cardsService: CardsService) {}

  async ngOnInit() {
    this.cards = await this.cardsService.getCards();
  }
}
