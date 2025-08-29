document.getElementById("pipButton").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: enterPiP
  });
});

document.getElementById("skipBack").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: skipBack
  });
});

document.getElementById("skipForward").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: skipForward
  });
});

// --- Functions injected into the webpage ---
function enterPiP() {
  const video = document.querySelector("video");
  if (video) {
    video.requestPictureInPicture();
  } else {
    alert("No video found!");
  }
}

function skipBack() {
  const video = document.querySelector("video");
  if (video) {
    video.currentTime -= 10;
  }
}

function skipForward() {
  const video = document.querySelector("video");
  if (video) {
    video.currentTime += 10;
  }
}
