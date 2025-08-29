// Same injected helpers as background.js, kept local to popup for simplicity.
function enterPiP() {
  const candidates = Array.from(document.querySelectorAll("video"));
  const video =
    candidates.find(v => !v.paused && !v.ended && v.readyState > 2) ||
    candidates[0];

  if (!video) {
    alert("No <video> found on this page.");
    return;
  }
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture?.().catch(() => {});
  }
  video.requestPictureInPicture?.().catch(err => {
    console.warn("[PopNPlay] PiP request failed:", err);
  });
}

function skipBack() {
  const video = document.querySelector("video");
  if (video) video.currentTime = Math.max(0, video.currentTime - 10);
}

function skipForward() {
  const video = document.querySelector("video");
  if (video) video.currentTime += 10;
}

async function runInActiveTab(fn) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: fn
  });
}

document.getElementById("pipButton").addEventListener("click", () => {
  runInActiveTab(enterPiP);
});

document.getElementById("skipBack").addEventListener("click", () => {
  runInActiveTab(skipBack);
});

document.getElementById("skipForward").addEventListener("click", () => {
  runInActiveTab(skipForward);
});

// Try to open the shortcuts page (some Chrome builds allow this directly)
document.getElementById("openShortcuts").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
  } catch {
    // Fallback: show a tip if blocked
    alert("Open chrome://extensions/shortcuts to customize hotkeys.");
  }
});
