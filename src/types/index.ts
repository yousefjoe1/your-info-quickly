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

export interface MyQuickInfo {
  field: string;
  title: string;
  type: string;
}
