import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Observable, Subject, EMPTY, retry, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable();

  constructor() {
    this.socket$ = this.connect();
    this.socket$.subscribe({
      next: message => this.messagesSubject$.next(message),
      error: error => console.error('WebSocket error:', error),
      complete: () => console.log('WebSocket connection closed'),
    });
  }

  private connect(): WebSocketSubject<any> {
    return webSocket({
      url: environment.websocketUrl,
      openObserver: {
        next: () => console.log('WebSocket connection established'),
      },
    });
  }

  sendMessage(message: any): void {
    this.socket$.next(message);
  }

  closeConnection(): void {
    this.socket$.complete();
  }

  getMessages(): Observable<any> {
    return this.messages$.pipe(
      retry(1),
      catchError(() => EMPTY)
    );
  }
}
