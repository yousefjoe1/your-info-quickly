import type { StorageData, Tab } from "../types";

// Background script for extension management
chrome.runtime.onInstalled.addListener(() => {
  console.log('Text Direction Toggle extension installed');
});

// Handle tab updates to apply saved directions


// Handle extension icon click to show current status
chrome.action.onClicked.addListener(async (tab: Tab) => {
  if (!tab.id || !tab.url) return;

  try {
    const hostname = new URL(tab.url).hostname;
    const result = await chrome.storage.local.get([hostname]) as StorageData;
    const currentDirection = result[hostname] || 'ltr';

    console.log(`Current direction for ${hostname}: ${currentDirection}`);
  } catch (error) {
    console.error('Error getting current direction:', error);
  }
});