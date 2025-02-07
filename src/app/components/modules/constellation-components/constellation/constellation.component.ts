import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../services/authentication.service';
import { ClientsService } from '../../../../services/clients.service';
import { ConstellationsService } from '../../../../services/constellations.service';
import { SnackBarService } from '../../../../services/snackbar.service';
import { WebsocketService } from '../../../../services/websocket.service';
import {
  cardTranslations,
  constellationTranslations,
} from '../../../../translations';
import { Card, Constellation, Client, Session } from '../../../../types';

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
  selectedType: 'personal' | 'personalGroup' | 'group' = 'personal';
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
    private authService: AuthenticationService,
    private snackBar: SnackBarService,
    private wsService: WebsocketService
  ) {
    this.userEmail = this.authService.getUserEmail() || '';

    // Subscribe to WebSocket messages
    this.wsService.messages$.subscribe(message => {
      console.log('Constellation received websocket message:', message);
      // Handle incoming messages here
    });
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
    return this.constellations.filter(c => {
      switch (this.selectedType) {
        case 'personal':
          return c.isPersonal;
        case 'personalGroup':
          return c.isPersonalGroup;
        case 'group':
          return c.isGroup;
        default:
          return false;
      }
    });
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

  async onSubmit(): Promise<void> {
    try {
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
            : this.clients.find(c => c.name === this.selectedClient)?.email ||
              '',
        clientId:
          this.selectedClient === 'new' ? undefined : this.selectedClientId,
        helperId: parseInt(this.authService.getUserId()),
      };

      console.log('Storing session object:', JSON.stringify(session, null, 2));

      // Send websocket message when creating new session
      this.wsService.sendMessage({ type: 'new_constellation', data: session });

      this.clientsService.storeConstellationSession(session).subscribe({
        next: response => {
          console.log('Session stored successfully:', response);
          this.snackBar.showSnackBar('Sikeres létrehozás!');
          this.clearForm();
        },
        error: error => {
          let errorMessage = 'Hiba történt a létrehozás során.';

          if (error.error?.message) {
            // Handle array of messages
            if (Array.isArray(error.error.message)) {
              errorMessage = error.error.message.join(', ');
            } else {
              errorMessage = error.error.message;
            }
          }

          this.snackBar.showSnackBar(errorMessage);
          console.error('Error storing session:', error);
        },
      });
    } catch (error) {
      let errorMessage = 'Váratlan hiba történt.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.snackBar.showSnackBar(errorMessage);
      console.error('Submission error:', error);
    }
  }

  onClientChange(clientName: string) {
    const selectedClient = this.clients.find(c => c.name === clientName);
    this.selectedClientId = selectedClient?.id;
  }
}
