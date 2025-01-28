import { Component } from '@angular/core';
import { ModulesService } from '../../../services/modules.service';
import { CommonModule } from '@angular/common';
import { UserModule } from '../../../types';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public modules: UserModule[] = [];

  constructor(private modulesService: ModulesService) {
    this.initModules();
  }

  private async initModules(): Promise<void> {
    try {
      this.modules = await this.modulesService.getModules();
      this.setDisplayNames();
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  }

  private setDisplayNames(): void {
    this.modules.forEach((module: UserModule) => {
      switch (module.name) {
        case 'chat': {
          module.displayName = 'Cset';
          break;
        }
        case 'constellation': {
          module.displayName = 'Állítás';
          break;
        }
        case 'case-assessment': {
          module.displayName = 'Esetfelmérő';
          break;
        }
      }
    });
  }
}
