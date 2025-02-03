import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConstellationsService } from '../../../services/constellations.service';
import { ClientsService } from '../../../services/clients.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Card, Constellation, Client, Session } from '../../../types';
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
  selectedCard: string = '';
  selectedConstellation: number = 0;
  selectedClient: string = '';
  newClientName: string = '';

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
    // Set initial constellation
    if (this.constellations.length > 0) {
      this.selectedConstellation = this.constellations[0].id;
    }
    if (this.userEmail) {
      this.clientsService
        .getClientsByEmail(this.userEmail)
        .subscribe(clients => {
          this.clients = clients.sort((a, b) => a.name.localeCompare(b.name));
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

  onSubmit() {
    const submission: Session = {
      cardId: this.selectedCard,
      id: this.selectedConstellation,
      type: this.selectedType,
      clientName: this.selectedClient || this.newClientName,
    };

    console.log('Session:', submission);
  }
}
