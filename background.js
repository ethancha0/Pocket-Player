chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;

  // Run in the PAGE'S main world so window.open inherits same origin
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: () => {
      const original =
        document.querySelector('video.html5-main-video') ||
        document.querySelector('video');

      if (!original) { alert("No <video> element found."); return; }

      try {
        const win = window.open('about:blank', '_blank');
        if (!win) { alert("Popup blocked. Allow pop-ups for this site."); return; }

        const d = win.document;
        d.write(`<!doctype html><title>Mirror</title>
          <style>html,body{margin:0;height:100%;background:#000}
          video{width:100%;height:100%;object-fit:contain;background:#000}</style>
          <video id="m" autoplay muted playsinline></video>`);
        d.close();

        const mirror = d.getElementById('m');
        mirror.srcObject = original.captureStream();
        mirror.play().catch(()=>{});
      } catch (e) {
        console.warn("Mirror failed:", e);
        alert("This video can't be mirrored (likely DRM). Try a normal YouTube video.");
      }
    }
  });
});
