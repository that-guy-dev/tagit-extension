chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {  
  chrome.storage.sync.set({ key: request });
  sendResponse({ 'success': true });
  location.reload();
});