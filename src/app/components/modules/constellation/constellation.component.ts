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
  selectedClientId?: number;
  newClientEmail: string = '';

  constructor(
    private constellationsService: ConstellationsService,
    private clientsService: ClientsService,
    private authService: AuthenticationService
  ) {
    this.userEmail = this.authService.getUserEmail() || '';
  }

  async ngOnInit() {
    this.cards = await this.constellationsService.getCardTypes();

    // Sort cards to put wisdomkeepers first, case insensitive
    this.cards.sort((a, b) => {
      if (a.name.toLowerCase() === 'wisdomkeepers') return -1;
      if (b.name.toLowerCase() === 'wisdomkeepers') return 1;
      return 0;
    });

    if (this.cards.length > 0) {
      this.selectedCard = this.cards[0].id;
    }
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

  private isValidEmail(email: string): boolean {
    const emailRegex =
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
  }

  isFormValid(): boolean {
    if (this.selectedType === 'personal') {
      if (this.selectedClient === 'new') {
        if (!this.newClientEmail || !this.isValidEmail(this.newClientEmail)) {
          return false;
        }
        return !!(
          this.selectedCard &&
          this.newClientName &&
          this.newClientEmail
        );
      }
      return !!(
        this.selectedCard &&
        this.selectedClient &&
        this.selectedClient !== ''
      );
    }
    return !!this.selectedCard;
  }

  clearForm() {
    this.selectedClient = '';
    this.newClientName = '';
    this.newClientEmail = '';
    this.selectedType = 'personal';
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    const session: Session = {
      cardId: parseInt(this.selectedCard),
      constellationType: this.selectedConstellation, // already a number, no parseInt needed
      type: this.selectedType,
      client:
        this.selectedClient === 'new'
          ? this.newClientName
          : this.selectedClient,
      clientEmail:
        this.selectedClient === 'new'
          ? this.newClientEmail
          : this.clients.find(c => c.name === this.selectedClient)?.email || '',
      clientId:
        this.selectedClient === 'new' ? undefined : this.selectedClientId,
      helperId: parseInt(this.authService.getUserId()),
    };

    console.log('Storing session object:', JSON.stringify(session, null, 2));

    this.clientsService.storeConstellationSession(session).subscribe({
      next: response => {
        console.log('Session stored successfully:', response);
        this.clearForm();
      },
      error: error => {
        console.error('Error storing session:', error);
      },
    });
  }

  onClientChange(clientName: string) {
    const selectedClient = this.clients.find(c => c.name === clientName);
    this.selectedClientId = selectedClient?.id;
  }
}
