import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Define interface for chart data
export interface onChart {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root', // Make the service available application-wide
})
export class DataSharingService {
  // Create a BehaviorSubject to hold and share data
  private onChartSubject = new BehaviorSubject<onChart>({}); // Initialize with empty object
  public onChart$ = this.onChartSubject.asObservable(); // Expose as observable

  // Method to update the data
  updateOnChart(onChart: onChart): void {
    this.onChartSubject.next(onChart);
    console.log('DataSharingService: Updated onChart data:', this.onChartSubject.value);
  }
}
