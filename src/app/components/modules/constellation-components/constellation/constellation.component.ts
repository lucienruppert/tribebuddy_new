import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  styleUrls: ['./constellation.component.css'],
  standalone: true,
  imports: [FormsModule, MatProgressSpinnerModule, NgIf, NgFor],
})
export class ConstellationComponent implements OnInit {
  isLoading = true;
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
    this.wsService.messages$.subscribe(message => {
      // Handle incoming messages here
    });
  }

  async ngOnInit() {
    try {
      this.isLoading = true;
      const [cards, constellations] = await Promise.all([
        this.constellationsService.getCardTypes(),
        this.constellationsService.getConstellations(),
      ]);

      this.cards = cards.sort((a, b) => {
        if (a.name.toLowerCase() === 'wisdomkeepers') return -1;
        if (b.name.toLowerCase() === 'wisdomkeepers') return 1;
        return 0;
      });

      this.constellations = constellations;
      console.log(this.constellations);

      if (this.cards.length > 0) {
        this.selectedCard = this.cards[0].id;
      }
      if (this.constellations.length > 0) {
        this.selectedConstellation = this.constellations[0].id;
      }

      if (this.userEmail) {
        await new Promise<void>(resolve => {
          this.clientsService
            .getClientsByEmail(this.userEmail)
            .subscribe(clients => {
              this.clients = clients.sort((a, b) =>
                a.name.localeCompare(b.name)
              );
              resolve();
            });
        });
      }
    } finally {
      this.isLoading = false;
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

  needsCards(): boolean {
    const selectedConst = this.constellations.find(
      c => c.id === this.selectedConstellation
    );
    return selectedConst?.needsCard || false;
  }
}
