chrome.runtime.onInstalled.addListener(() => {
    console.log('Picture-in-Picture extension installed.');
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "togglePiP") {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        function: togglePictureInPicture
      });
      sendResponse({status: "PiP toggled"});
    }
  });
  
  function togglePictureInPicture() {
    const video = document.querySelector('video');
    
    if (!video) {
      console.log('No video element found.');
      return;
    }
  
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      video.requestPictureInPicture();
    }
  }
  