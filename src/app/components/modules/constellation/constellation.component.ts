import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from '../../../services/constellations.service'; 
import { Card, Constellation } from '../../../types';
import {
  cardTranslations,
  constellationTranslations,
} from '../../../shared/translations/card-translations';

@Component({
  selector: 'app-constellation',
  templateUrl: './constellation.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ConstellationComponent implements OnInit {
  cards: Card[] = [];
  constellations: Constellation[] = [];

  constructor(private cardsService: CardsService) {}

  async ngOnInit() {
    this.cards = await this.cardsService.getCardTypes();
    this.constellations = await this.cardsService.getConstellations();
  }

  getTranslatedCardName(cardName: string): string {
    return cardTranslations[cardName] || cardName;
  }

  getTranslatedConstellationName(name: string): string {
    return constellationTranslations[name] || name;
  }
}
