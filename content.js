(() => {
  const addButtonToWatchLater = () => {
    const items = document.querySelectorAll("ytd-playlist-video-renderer");
    items.forEach((item) => {
      if (item.querySelector(".yt-reminder-btn")) return; // avoid duplicates

      const btn = document.createElement("img");
      btn.src = chrome.runtime.getURL("assets/add-bookmark.png");
      btn.className = "yt-reminder-btn";
      btn.title = "Click to get notification on this video"
      btn.style.cursor = "pointer";
      btn.style.width = "24px";
      btn.style.marginLeft = "10px";

      // Add behind video title
      const titleRow = item.querySelector("#meta");
      if (titleRow) {
        titleRow.append(btn);
      }

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const link = item.querySelector("a#thumbnail"); // get the thumbnail
        const videoUrl = link?.href;  // get the url
        const videoId = new URL(videoUrl).searchParams.get("v");
        const titleEl = item.querySelector("#video-title");
        const videoTitle = titleEl?.textContent.trim() || "Untitled video";
        const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

        chrome.runtime.sendMessage({
          type: "SAVE_BOOKMARK",
          video: { id: videoId, url: videoUrl, thumbnail, title: videoTitle, frequency: 30 } // default 30 min
        });
      });
    });
  };

  // Observe page changes (YouTube uses dynamic loading)
  const observer = new MutationObserver(addButtonToWatchLater);
  observer.observe(document.body, { childList: true, subtree: true });

  addButtonToWatchLater();
})();
