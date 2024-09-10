document.getElementById('pipButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({ action: "togglePiP" }, (response) => {
      console.log(response.status);
    });
  });
});
