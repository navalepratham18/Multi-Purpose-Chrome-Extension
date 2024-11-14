// Ad-blocker - Logic
chrome.storage.sync.get({ optOutAnalytics: false }, results => {
  const optOutAnalytics = results.optOutAnalytics;

  if (!optOutAnalytics) {
    const adBlockList = [
      "*://*.doubleclick.net/*",
      "*://*.googlesyndication.com/*",
      "*://*.googleadservices.com/*",
      "*://*.facebook.com/*",
      "*://*.amazon.in/*",
      "*://*.adnxs.com/*",
      "*://*.adsafeprotected.com/*",
      "*://*.advertising.com/*",
      "*://*.yieldmanager.com/*",
      "*://*.moatads.com/*",
      "*://*.criteo.com/*",
      "*://*.taboola.com/*"
    ];

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: adBlockList.map((urlPattern, id) => ({
        "id": id + 1,
        "priority": 1,
        "action": { "type": "block" },
        "condition": { "urlFilter": urlPattern }
      })),
      removeRuleIds: Array.from(Array(adBlockList.length), (_, i) => i + 1)
    });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.optOutAnalytics) {
    const optOutAnalytics = changes.optOutAnalytics.newValue;

    if (optOutAnalytics) {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from(Array(10), (_, i) => i + 1) 
      });
    } else {
      const adBlockList = [
        "*://*.doubleclick.net/*",
        "*://*.googlesyndication.com/*",
        "*://*.googleadservices.com/*",
        "*://*.facebook.com/*",
        "*://*.amazon.in/*",
        "*://*.adnxs.com/*",
        "*://*.adsafeprotected.com/*",
        "*://*.advertising.com/*",
        "*://*.yieldmanager.com/*",
        "*://*.moatads.com/*",
        "*://*.criteo.com/*",
        "*://*.taboola.com/*"
      ];

      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: adBlockList.map((urlPattern, id) => ({
          "id": id + 1,
          "priority": 1,
          "action": { "type": "block" },
          "condition": { "urlFilter": urlPattern }
        })),
        removeRuleIds: []
      });
    }
  }
});

// Optional: Log when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed..!!');
});
