export interface User {
  id?: string;
  email?: string;
  role?: string;
  password?: string;
  name?: string;
  sex?: 'male' | 'female';
  errors?: string[];
}

export interface UserModule {
  id: string;
  name: string;
  isAvailable: boolean;
  displayName?: string;
}

export interface Card {
  id: string;
  name: string;
  displayName?: string;
}

export interface EmailSendingResult {
  sent: string;
  failed: string[];
}

export interface PhotosRequestResult {
  status: string;
  photosData: PhotoData[];
}

export interface PhotoData {
  fileName: string;
  isProfile: boolean;
  isLoaded?: boolean;
}

export interface ApiCallResponse {
  status: string;
  message: string;
}

export interface PhotoUploadResponse {
  message: string;
  fileName: string;
}

export interface UserProfile {
  email?: string | null;
  nickname: string;
  age: string;
  aboutMe: string;
  height: string;
  build: string;
  languages: string;
  movies: string;
  music: string;
  books: string;
  foods: string;
  drinks: string;
  county: string;
  district: string;
}

export interface Constellation {
  id: number;
  name: string;
  isPersonal: boolean;
  isPersonalGroup: boolean;
  isGroup: boolean;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  helperId: number;
}

export interface Session {
  cardId: number;
  constellationType: number;
  type: 'personal' | 'personalGroup' | 'group';
  client: string;
  clientEmail: string;
  clientId?: number;
  id?: number;
  helperId?: number;
}
