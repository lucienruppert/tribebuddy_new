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
  selections: { [key: string]: number } = {};

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
    this.updateSelections();
  }

  private updateSelections() {
    Object.entries(this.geneKeyValues).forEach(([key, value]) => {
      if (value) {
        this.selections[key] = parseInt(value);
      }
    });
    console.log('Current selections:', this.selections);
  }

  onKeyDown(event: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (event.keyCode === 65 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)
    ) {
      return true;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
      (event.keyCode < 96 || event.keyCode > 105)
    ) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validateInput(event: any, key: string) {
    const value = event.target.value;

    // Allow empty input for backspace/delete
    if (value === '') {
      this.geneKeyValues[key] = '';
      return;
    }

    // Only allow numbers and enforce max length
    if (!/^\d{1,2}$/.test(value)) {
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
