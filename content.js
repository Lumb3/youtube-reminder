(() => { // content.js
  const addBookmarkButton = (item) => {
    // Avoid duplicates
    if (item.querySelector(".yt-reminder-btn")) return;

    // Create button
    const btn = document.createElement("button");
    btn.className = "yt-reminder-btn";
    btn.title = "Bookmark this video";
    btn.style.cssText = `
      background: url(${chrome.runtime.getURL("assets/add-bookmark.png")}) no-repeat center/contain;
      width: 24px;
      height: 24px;
      border: none;
      cursor: pointer;
      margin-left: 10px;
      padding: 0;
      outline: none;
      transition: transform 0.1s ease, opacity 0.2s ease;
    `;

    // Add interactive styles
    btn.addEventListener("mouseenter", () => {
      btn.style.opacity = "0.85";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.opacity = "1";
      btn.style.transform = "scale(1)";
    });
    btn.addEventListener("mousedown", () => {
      btn.style.transform = "scale(0.9)"; // shrink when pressed
    });
    btn.addEventListener("mouseup", () => {
      btn.style.transform = "scale(1)"; // return to normal
    });

    // Add behind video title (inside #meta)
    const titleRow = item.querySelector("#meta");
    if (titleRow) {
      titleRow.append(btn);
    }

    // Click event
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const link = item.querySelector("a#thumbnail");
      const videoUrl = link?.href;
      if (!videoUrl) return;

      let videoId = null;
      if (videoUrl.includes("watch")) {
        videoId = new URL(videoUrl).searchParams.get("v");
      } else if (videoUrl.includes("shorts")) {
        videoId = videoUrl.split("/shorts/")[1]?.split("?")[0];
      }

      if (!videoId) return;

      const titleEl = item.querySelector("#video-title");
      const videoTitle = titleEl?.textContent.trim() || "Untitled video";
      const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

      chrome.runtime.sendMessage({
        type: "SAVE_BOOKMARK",
        video: { 
          id: videoId, 
          url: videoUrl, 
          thumbnail, 
          title: videoTitle, 
          frequency: 0.1 // default 30 min
        }
      });
    });
  };

  // Initial pass for already loaded items
  document.querySelectorAll("ytd-playlist-video-renderer").forEach(addBookmarkButton);

  // Observe dynamic changes (YouTube SPA behavior)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.matches?.("ytd-playlist-video-renderer")) {
          addBookmarkButton(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
