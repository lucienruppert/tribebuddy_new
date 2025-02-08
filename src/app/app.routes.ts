import { Card } from './types';
import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/Views/user-profile/user-profile.component';
import { HomeComponent } from './components/Views/home/home.component';
import { GeneralRouteGuardService } from './services/general-route-guard.service';
import { UserPhotosComponent } from './components/Views/user-photos/user-photos.component';
import { ContractComponent } from './components/contract/contract.component';
import { DataProtectionComponent } from './components/data-protection/data-protection.component';
import { DashboardComponent } from './components/Views/dashboard/dashboard.component';
import { CardTypesComponent } from './components/modules/constellation-components/card-types/card-types.component';
import { ConstellationComponent } from './components/modules/constellation-components/constellation-selector/constellation.component';
import { CardDeckComponent } from './components/modules/constellation-components/card-deck/card-deck.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'userprofile',
    component: UserProfileComponent,
    canActivate: [GeneralRouteGuardService],
  },
  {
    path: 'userphotos',
    component: UserPhotosComponent,
    canActivate: [GeneralRouteGuardService],
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
  },
  {
    path: 'constellation',
    component: ConstellationComponent,
  },
  {
    path: 'card-types',
    component: CardTypesComponent,
  },
  {
    path: 'card-deck',
    component: CardDeckComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
