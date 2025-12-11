export interface EditHistoryItem {
  id: string;
  originalImage: string; // Base64
  editedImage: string; // Base64
  prompt: string;
  timestamp: number;
}

export type AppState = 'upload' | 'editing' | 'result';

export interface ImageDimensions {
  width: number;
  height: number;
}
