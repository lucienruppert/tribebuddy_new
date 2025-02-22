export interface SessionStartMessage {
  type: 'sessionStart';
  sessionType: string;
  constellation: string;
  email: string | null;
  sessionId: string;
}

export interface SessionEndMessage {
  type: 'sessionEnd';
  email: string | null;
}