import { Routes } from '@angular/router';
import { HomeComponent } from './components/Views/home/home.component';
import { ContractComponent } from './components/contract/contract.component';
import { DataProtectionComponent } from './components/data-protection/data-protection.component';
import { DashboardComponent } from './components/Views/dashboard/dashboard.component';
import { CardTypesComponent } from './components/modules/constellation-components/card-types/card-types.component';
import { ConstellationSelectorComponent } from './components/modules/constellation-components/constellation-selector/constellation-selector.component';
import { CardDeckComponent } from './components/modules/constellation-components/card-deck/card-deck.component';
import { GenekeysPreselectorComponent } from './components/modules/constellation-components/genekeys-preselector/genekeys-preselector.component';
import { GenekeysChartComponent } from './components/modules/constellation-components/genekeys-chart/genekeys-chart.component';
import { AuthRedirectGuardService } from './services/auth-redirect-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'contract',
    component: ContractComponent,
  },
  {
    path: 'dataprotection',
    component: DataProtectionComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthRedirectGuardService],
  },
  {
    path: 'constellation',
    component: ConstellationSelectorComponent,
    canActivate: [AuthRedirectGuardService],
  },
  {
    path: 'genekeys-preselector',
    component: GenekeysPreselectorComponent,
    canActivate: [AuthRedirectGuardService],
  },
  {
    path: 'genekeys-chart',
    component: GenekeysChartComponent,
  },
  {
    path: 'card-types',
    component: CardTypesComponent,
    canActivate: [AuthRedirectGuardService],
  },
  {
    path: 'card-deck',
    component: CardDeckComponent,
    canActivate: [AuthRedirectGuardService],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
