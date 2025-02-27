import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Make the service available application-wide
})
export class DataSharingService {
  // Create a BehaviorSubject to hold and share data
  private onChartSubject = new BehaviorSubject<number[]>([]); // Initialize with default value
  public onChart$ = this.onChartSubject.asObservable(); // Expose as observable

  // Method to update the data
  updateOnChart(onChart: number[]): void {
    this.onChartSubject.next(onChart);
    console.log('OnChart data:', this.onChartSubject.value);
  }
}
