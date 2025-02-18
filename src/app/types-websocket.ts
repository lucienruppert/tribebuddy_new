export interface SessionStartMessage {
  type: 'sessionStart';
  sessionType: string; 
  constellation: string; 
  email: string | null;
}
