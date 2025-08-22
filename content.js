(()=> { // displays in youtube page
  let youtubePlayer;
  let curentVideo = "";
  let currentBookmarkedVideos = [];
  
  

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NEW_BOOKMARK") {
    console.log("Content script received video ID:", message.videoID);

    // Example: show a little UI injection (like a "Bookmark this video" button)
    let btn = document.getElementById("yt-bookmark-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "yt-bookmark-btn";
      btn.textContent = "🔖 Add Reminder";
      btn.style.position = "absolute";
      btn.style.top = "100px";
      btn.style.right = "20px";
      btn.style.zIndex = 9999;
      document.body.appendChild(btn);
    }
  }
});

})();