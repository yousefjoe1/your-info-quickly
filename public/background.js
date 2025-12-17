chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // GET
  if (message.action === 'getData') {
    chrome.storage.local.get(['info'], (result) => {
      sendResponse({
        success: true,
        data: result.info || []
      });
    });
    return true; // ⬅️ مهم
  }

  // SAVE
  if (message.action === 'saveData') {
    chrome.storage.local.set(
      { info: message.data },
      () => {
        sendResponse({ success: true });
      }
    );
    return true; // ⬅️ مهم جدًا
  }

});
