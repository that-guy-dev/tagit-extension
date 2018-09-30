// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//     console.log('test');
//     console.log({ request });
//     chrome.storage.sync.set({ token: request });			
//     sendResponse();
//   }
// );

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {  
  var token = request;
  chrome.storage.sync.set({ key: token });
  sendResponse({ token });
});