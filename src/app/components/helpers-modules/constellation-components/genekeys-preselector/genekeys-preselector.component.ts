import { geneKeys } from '../../../../../../constants';
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ClientsService } from '../../../../services/clients.service';
import { geneKeyTranslations } from '../../../../translations';
import { FormsModule } from '@angular/forms';
import { GeneKeysData } from '../../../../types';
import { SnackBarService } from '../../../../services/snackbar.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genekeys-preselector',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './genekeys-preselector.component.html',
  styleUrl: './genekeys-preselector.component.css',
})
export class GenekeysPreselectorComponent implements OnInit {
  clientName: string = '';
  geneKeys = geneKeys;
  focusedIndex: number = -1;
  geneKeyValues: { [key: string]: string } = {};
  selections: { [key: string]: number } = {};
  duplicateValues: Set<string> = new Set();
  isInitialized: boolean = false;

  constructor(
    private clientsService: ClientsService,
    private snackbarService: SnackBarService,
    private dialogRef: DialogRef<GenekeysPreselectorComponent>,
    private router: Router
  ) {}

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
    this.isInitialized = true;
    Object.entries(this.geneKeyValues).forEach(([key, value]) => {
      if (value) {
        this.selections[key] = parseInt(value);
      }
    });
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

  isFormValid(): boolean {
    if (!this.isInitialized) return false;

    // Check if we have values for all gene keys
    const allFieldsFilled = this.geneKeys.every(
      key => this.geneKeyValues[key] && this.geneKeyValues[key].length > 0
    );

    return allFieldsFilled && this.duplicateValues.size === 0;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      const geneKeysData = Object.entries(this.geneKeyValues).reduce(
        (acc, [key, value]) => {
          acc[key] = parseInt(value);
          return acc;
        },
        {} as { [key: string]: number }
      );

      this.clientsService.storeGeneKeys(geneKeysData).subscribe({
        next: response => {
          console.log('Gene keys stored successfully:', response);
          this.snackbarService.showMessage(
            'A kliens génkulcsai mentésre kerültek.'
          );
          this.dialogRef.close();
          setTimeout(() => {
            this.snackbarService.showMessage('Most már kezdheted az állítást!');
            this.router.navigate(['/constellations/genekeys/chart']);
          }, 500);
        },
        error: error => {
          console.error('Error storing gene keys:', error);
        },
      });
    }
  }
}
