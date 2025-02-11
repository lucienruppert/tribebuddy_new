import { geneKeys } from '../../../../../../constants';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output() submitGeneKeys = new EventEmitter<{ [key: string]: string }>();

  clientName: string = '';
  geneKeys = geneKeys;
  focusedIndex: number = -1;
  geneKeyValues: { [key: string]: string } = {};
  selections: { [key: string]: number } = {};
  duplicateValues: Set<string> = new Set();

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
    this.checkForDuplicates();
  }

  private updateSelections() {
    Object.entries(this.geneKeyValues).forEach(([key, value]) => {
      if (value) {
        this.selections[key] = parseInt(value);
      }
    });
    console.log('Current selections:', this.selections);
  }

  private checkForDuplicates() {
    this.duplicateValues.clear();
    const values = new Map<string, string>();

    Object.entries(this.geneKeyValues).forEach(([key, value]) => {
      if (!value) return;

      const existingKey = Array.from(values.entries()).find(
        ([_, v]) => v === value
      )?.[0];

      if (existingKey) {
        this.duplicateValues.add(existingKey);
        this.duplicateValues.add(key);
      } else {
        values.set(key, value);
      }
    });
  }

  isDuplicate(key: string): boolean {
    return this.duplicateValues.has(key);
  }

  onKeyDown(event: KeyboardEvent): boolean {
    // Allow navigation keys
    if (
      ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
        event.key
      )
    ) {
      return true;
    }

    // Get the future value after this keypress
    const input = event.target as HTMLInputElement;
    const futureValue = input.value + event.key;
    const num = parseInt(futureValue);

    // Only allow if the result would be a valid number between 1-64
    if (/^\d+$/.test(event.key) && num >= 1 && num <= 64) {
      return true;
    }

    event.preventDefault();
    return false;
  }

  validateInput(event: any, key: string) {
    const input = event.target;
    const value = input.value.trim();
    const previousValue = this.geneKeyValues[key] || '';

    // Handle empty input
    if (value === '') {
      this.geneKeyValues[key] = '';
      input.value = '';
      return;
    }

    const num = parseInt(value);
    if (!num || num < 1 || num > 64) {
      input.value = previousValue;
      return;
    }

    this.geneKeyValues[key] = num.toString();
    input.value = num.toString();
  }

  onSubmit(): void {
    if (Object.values(this.geneKeyValues).every(value => value)) {
      this.submitGeneKeys.emit(this.geneKeyValues);
    }
  }
}
