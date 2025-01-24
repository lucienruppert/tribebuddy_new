import { Component } from '@angular/core';
import { ModulesService } from '../../../services/modules.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private modulesService: ModulesService) {
    this.initModules();
  }

  private async initModules(): Promise<void> {
    try {
      const modules = await this.modulesService.getModules();
      console.log('Modules:', modules);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  }
}
