import { Component } from '@angular/core';
import { ModulesService } from '../../../services/modules.service';
import { CommonModule } from '@angular/common';
import { Module } from '../../../types';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  modules: Module[] = [];

  constructor(private modulesService: ModulesService) {
    this.initModules();
  }

  private async initModules(): Promise<void> {
    try {
      this.modules = await this.modulesService.getModules();
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  }
}
