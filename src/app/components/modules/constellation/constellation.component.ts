import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstellationsService } from '../../../services/constellations.service'; 
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

  constructor(private constellationsService: ConstellationsService ) {}

  async ngOnInit() {
    this.cards = await this.constellationsService.getCardTypes();
    this.constellations = await this.constellationsService.getConstellations();
  }

  getTranslatedCardName(cardName: string): string {
    return cardTranslations[cardName] || cardName;
  }

  getTranslatedConstellationName(name: string): string {
    return constellationTranslations[name] || name;
  }
}
