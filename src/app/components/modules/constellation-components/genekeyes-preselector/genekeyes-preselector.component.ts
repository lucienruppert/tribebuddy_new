import { geneKeys } from '../../../../../../constants';
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ClientsService } from '../../../../services/clients.service';
import { geneKeyTranslations } from '../../../../translations';

@Component({
  selector: 'app-genekeyes-preselector',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './genekeyes-preselector.component.html',
  styleUrl: './genekeyes-preselector.component.css',
})
export class GenekeyesPreselectorComponent implements OnInit {
  clientName: string = '';
  geneKeys = geneKeys;

  constructor(private clientsService: ClientsService) {}

  ngOnInit() {
    this.clientName = this.clientsService.getClientName();
  }

  getTranslatedGeneKey(key: string): string {
    return geneKeyTranslations[key] || key;
  }
}
