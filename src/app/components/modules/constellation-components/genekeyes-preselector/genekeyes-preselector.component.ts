import { geneKeys } from '../../../../../../constants';
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ClientsService } from '../../../../services/clients.service';
import { geneKeyTranslations } from '../../../../translations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genekeyes-preselector',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './genekeyes-preselector.component.html',
  styleUrl: './genekeyes-preselector.component.css',
})
export class GenekeyesPreselectorComponent implements OnInit {
  clientName: string = '';
  geneKeys = geneKeys;
  focusedIndex: number = -1;
  geneKeyValues: { [key: string]: string } = {};

  constructor(private clientsService: ClientsService) {}

  ngOnInit() {
    this.clientName = this.clientsService.getClientName();
  }

  getTranslatedGeneKey(key: string): string {
    return geneKeyTranslations[key] || key;
  }

  onFocus(index: number) {
    this.focusedIndex = index;
  }

  onBlur() {
    this.focusedIndex = -1;
  }

  validateInput(event: any, key: string) {
    const value = event.target.value;

    // Allow empty input for backspace/delete
    if (value === '') {
      this.geneKeyValues[key] = '';
      return;
    }

    // Prevent 3 or more digits
    if (value.length > 2) {
      event.target.value = this.geneKeyValues[key] || '';
      return;
    }

    // Only allow numbers
    if (!/^\d+$/.test(value)) {
      event.target.value = this.geneKeyValues[key] || '';
      return;
    }

    const num = parseInt(value);
    if (num >= 1 && num <= 64) {
      this.geneKeyValues[key] = value;
    } else {
      event.target.value = this.geneKeyValues[key] || '';
    }
  }
}
