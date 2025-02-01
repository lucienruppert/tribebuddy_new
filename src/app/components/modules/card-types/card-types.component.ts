import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from '../../../services/cards.service';
import { Card } from '../../../types';
import { cardTranslations } from '../../../shared/translations/card-translations';

@Component({
  selector: 'app-card-types',
  templateUrl: './card-types.component.html',
  styleUrl: './card-types.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class CardTypesComponent implements OnInit {
  cards: Card[] = [];
  private imageExtensions: { [key: string]: string } = {
    default: 'jpg',
    wisdomKeepers: 'jpeg',
    tarot: 'png',
    osho: 'jpg',
  };

  constructor(private cardsService: CardsService) {}

  async ngOnInit() {
    this.cards = await this.cardsService.getCardTypes();
    this.setDisplayNames();
  }

  getImagePath(cardName: string): string {
    const extension = this.imageExtensions[cardName] || 'jpg';
    return `assets/${cardName}.${extension}`;
  }

  private setDisplayNames(): void {
    this.cards.forEach((card: Card) => {
      card.displayName = cardTranslations[card.name] || card.name;
    });
  }
}
