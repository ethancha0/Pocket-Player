function enterPiP() {
  const vids = Array.from(document.querySelectorAll("video"));
  const video = vids.find(v => !v.paused && !v.ended && v.readyState > 2) || vids[0];
  if (!video) return;
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture?.().catch(() => {});
  }
  video.requestPictureInPicture?.().catch(() => {});
}

function skipBack() {
  const v = document.querySelector("video");
  if (v) v.currentTime = Math.max(0, v.currentTime - 10);
}

function skipForward() {
  const v = document.querySelector("video");
  if (v) v.currentTime += 10;
}

async function runInActiveTab(fn) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: fn
  });
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "pip")          await runInActiveTab(enterPiP);
  if (command === "skip-back")    await runInActiveTab(skipBack);
  if (command === "skip-forward") await runInActiveTab(skipForward);
});
