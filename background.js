
chrome.runtime.onInstalled.addListener(() => {
    console.log('Picture-in-Picture Extension installed');
});


chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked');
});
