// // chrome.d.ts
// declare namespace chrome {
//   namespace tabs {
//     interface Tab {
//       id?: number;
//       url?: string;
//       title?: string;
//       active?: boolean;
//       pinned?: boolean;
//       windowId?: number;
//     }

    

//     interface QueryInfo {
//       active?: boolean;
//       currentWindow?: boolean;
//       url?: string | string[];
//     }
// namespace onUpdated {
//       function addListener(callback: (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => void): void;
//     }
  
//     function query(queryInfo: QueryInfo, callback: (tabs: Tab[]) => void): void;
//     function query(queryInfo: QueryInfo): Promise<Tab[]>;
    
//     function sendMessage(tabId: number, message: unknown, responseCallback?: (response: unknown) => void): void;
//     function sendMessage(tabId: number, message: unknown): Promise<unknown>;
//   }

//   namespace runtime {
//     interface MessageSender {
//       tab?: Tab;
//       id?: string;
//     }

//     function sendMessage(message: unknown, responseCallback?: (response: unknown) => void): void;
//     function sendMessage(message: unknown): Promise<unknown>;

//     namespace onInstalled {
//       function addListener(callback: (details: {
//         reason: 'install' | 'update' | 'chrome_update';
//         previousVersion?: string;
//         id?: string;
//       }) => void): void;
//     }

    
    
//     const onMessage: {
//       addListener(callback: (
//         message: ChromeMessage,
//         sender: MessageSender,
//         sendResponse: (response?: unknown) => void
//       ) => boolean | void): void;
//     };
//   }

//   namespace storage {
//     interface StorageArea {
//       get(keys: string | string[] | null, callback: (items: { [key: string]: unknown }) => void): void;
//       get(keys: string | string[] | null): Promise<{ [key: string]: unknown }>;
      
//       set(items: { [key: string]: unknown }, callback?: () => void): void;
//       set(items: { [key: string]: unknown }): Promise<void>;
      
//       remove(keys: string | string[], callback?: () => void): void;
//       remove(keys: string | string[]): Promise<void>;
//     }

//     const local: StorageArea;
//     const sync: StorageArea;
//   }

//   namespace action {
//     const onClicked: {
//       addListener(callback: (tab: Tab) => void): void;
//     };
//   }
// }

// // Global chrome object
// declare const chrome: typeof chrome;
/// <reference types="chrome" />