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
    this.setDisplayNames();
    console.log(this.cards);
  }

   private setDisplayNames(): void {
      this.cards.forEach((card: Card) => {
        switch (card.name) {
          case 'default': {
            card.displayName = 'Alap';
            break;
          }
          case 'wisdomKeepers': {
            card.displayName = 'Bölcsességőrzők';
            break;
          }
          case 'tarot': {
            card.displayName = 'Tarot';
            break;
          }
        }
      });
    }
}
