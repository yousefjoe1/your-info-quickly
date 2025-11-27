export interface Tab {
  id?: number;
  url?: string;
  title?: string;
}

export interface StorageData {
  [hostname: string]: 'ltr' | 'rtl';
}

export interface ChromeMessage {
  action: 'setDirection';
  direction: 'ltr' | 'rtl';
}

export interface DirectionManager {
  currentDirection: 'ltr' | 'rtl';
  init(): void;
  applySavedDirection(): Promise<void>;
  setDirection(direction: 'ltr' | 'rtl'): void;
  getCurrentDirection(): 'ltr' | 'rtl';
}

export interface TabChangeInfo {
  status?: 'loading' | 'complete' | 'unloaded' | undefined;
}