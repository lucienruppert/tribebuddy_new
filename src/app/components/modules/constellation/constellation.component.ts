import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from '../../../services/constellations.service';
import { Card } from '../../../types';
import { cardTranslations } from '../../../shared/translations/card-translations';

@Component({
  selector: 'app-constellation',
  templateUrl: './constellation.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ConstellationComponent implements OnInit {
  cards: Card[] = [];

  constructor(private cardsService: CardsService) {}

  async ngOnInit() {
    this.cards = await this.cardsService.getCardTypes();
  }

  getTranslatedName(cardName: string): string {
    return cardTranslations[cardName] || cardName;
  }
}
