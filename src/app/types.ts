export interface User {
  email?: string;
  role?: string;
  password?: string;
  name?: string;
  sex?: "male" | "female";
  errors?: string[];
}

export interface Module {
  id: string;
  name: string;
  isAvailable: boolean;
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
