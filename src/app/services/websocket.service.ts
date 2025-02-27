import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import {
  Observable,
  Subject,
  EMPTY,
  retry,
  catchError,
  BehaviorSubject,
  timer,
  of,
} from 'rxjs';
import { switchMap, takeUntil, delay, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable();
  private connectionStatus$ = new BehaviorSubject<boolean>(false);
  private reconnecting$ = new Subject<void>();
  private destroySocket$ = new Subject<void>();

  constructor() {
    this.connect();
  }

  // Public method to get connection status
  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }

  private connect(): void {
    if (this.socket$ !== null) {
      this.socket$.complete();
      this.socket$ = null;
    }

    console.log(
      'Attempting to connect to WebSocket:',
      environment.websocketUrl
    );

    this.socket$ = webSocket({
      url: environment.websocketUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket connection established');
          this.connectionStatus$.next(true);
        },
      },
      closeObserver: {
        next: event => {
          console.log('WebSocket connection closed', event);
          this.connectionStatus$.next(false);
          this.reconnect();
        },
      },
    });

    this.socket$
      .pipe(
        takeUntil(this.destroySocket$),
        catchError(error => {
          console.error('WebSocket error:', error);
          this.connectionStatus$.next(false);
          return EMPTY;
        })
      )
      .subscribe({
        next: message => {
          console.log('Received message:', message);
          this.messagesSubject$.next(message);
        },
        error: error => {
          console.error('WebSocket subscription error:', error);
          this.connectionStatus$.next(false);
          this.reconnect();
        },
        complete: () => {
          console.log('WebSocket connection completed');
          this.connectionStatus$.next(false);
        },
      });
  }

  private reconnect(): void {
    this.reconnecting$.next();

    // Attempt to reconnect after 3 seconds
    timer(3000)
      .pipe(
        takeUntil(this.destroySocket$),
        tap(() => console.log('Attempting to reconnect...')),
        finalize(() => console.log('Reconnection attempt finished'))
      )
      .subscribe(() => {
        this.connect();
      });
  }

  sendMessage(message: any): void {
    if (!this.socket$ || this.connectionStatus$.value === false) {
      console.warn('Cannot send message: WebSocket not connected');
      return;
    }

    console.log('Sending message:', message);
    try {
      this.socket$.next(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  closeConnection(): void {
    this.destroySocket$.next();
    this.destroySocket$.complete();

    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }

    this.connectionStatus$.next(false);
  }

  getMessages(): Observable<any> {
    return this.messages$.pipe(
      retry(1),
      catchError(error => {
        console.error('Error in messages stream:', error);
        return EMPTY;
      })
    );
  }
}
