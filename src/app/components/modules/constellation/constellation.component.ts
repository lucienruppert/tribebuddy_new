import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConstellationsService } from '../../../services/constellations.service';
import { ClientsService } from '../../../services/clients.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Card, Constellation, Client } from '../../../types';
import {
  cardTranslations,
  constellationTranslations,
} from '../../../translations';

@Component({
  selector: 'app-constellation',
  templateUrl: './constellation.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ConstellationComponent implements OnInit {
  cards: Card[] = [];
  constellations: Constellation[] = [];
  clients: Client[] = [];
  selectedType: 'personal' | 'group' = 'personal';
  userEmail: string = '';

  constructor(
    private constellationsService: ConstellationsService,
    private clientsService: ClientsService,
    private authService: AuthenticationService
  ) {
    this.userEmail = this.authService.getUserEmail() || '';
  }

  async ngOnInit() {
    this.cards = await this.constellationsService.getCardTypes();
    this.constellations = await this.constellationsService.getConstellations();
    if (this.userEmail) {
      this.clientsService
        .getClientsByEmail(this.userEmail)
        .subscribe(clients => {
          this.clients = clients;
        });
    }
  }

  getTranslatedCardName(cardName: string): string {
    return cardTranslations[cardName] || cardName;
  }

  getTranslatedConstellationName(name: string): string {
    return constellationTranslations[name] || name;
  }

  getFilteredConstellations(): Constellation[] {
    return this.constellations.filter(c =>
      this.selectedType === 'personal' ? c.isPersonal : c.isGroup
    );
  }
}
