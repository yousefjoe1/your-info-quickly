import type { DirectionManager } from "../types";

// Content script that runs on every page
class DirectionManagerImpl implements DirectionManager {
  currentDirection: 'ltr' | 'rtl' = 'ltr';

  constructor() {
    this.init();
  }

  init(): void {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("🚀 ~ DirectionManagerImpl ~ init ~ sender:", sender)
  if (message.action === "setDirection") {
    document.documentElement.dir = message.direction;
    document.body.dir = message.direction;
    sendResponse({ success: true });
  }
  return true; // Keep the message channel open for async response
});

    // Apply saved direction on page load
    this.applySavedDirection();
  }

  async applySavedDirection(): Promise<void> {
    try {
      const hostname = window.location.hostname;
      const result = await chrome.storage.local.get([hostname]) as { [key: string]: 'ltr' | 'rtl' };
      if (result[hostname]) {
        this.setDirection(result[hostname]);
      }
    } catch (error) {
      console.error('Error applying saved direction:', error);
    }
  }

  setDirection(direction: 'ltr' | 'rtl'): void {
    this.currentDirection = direction;
    
    // Remove existing direction style
    const existingStyle = document.getElementById('text-direction-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    if (direction === 'rtl') {
      // Create and inject RTL styles
      const style = document.createElement('style');
      style.id = 'text-direction-style';
      style.textContent = `
        body {
          direction: rtl !important;
          text-align: right !important;
        }
        
        /* Additional RTL adjustments */
        .container, .content, .main, [class*="container"], [class*="content"] {
          direction: rtl !important;
          text-align: right !important;
        }
        
        /* Fix for flex containers */
        [style*="flex"] {
          direction: rtl !important;
        }
        
        /* Input fields */
        input, textarea {
          text-align: right !important;
        }
        
        /* Lists */
        ul, ol {
          padding-right: 20px !important;
          padding-left: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Dispatch custom event for any additional handling
    document.dispatchEvent(new CustomEvent('textDirectionChanged', {
      detail: { direction }
    }));
  }

  getCurrentDirection(): 'ltr' | 'rtl' {
    return this.currentDirection;
  }
}

// Initialize the direction manager
const directionManager = new DirectionManagerImpl();

// Export for potential external use
export default directionManager;