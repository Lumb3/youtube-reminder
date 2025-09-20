// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_BOOKMARK") {
    chrome.storage.sync.get(["bookmarks"], (data) => {
      let bookmarks = data.bookmarks || [];
      if (!bookmarks.some((v) => v.id === message.video.id)) {
        bookmarks.push(message.video);
        chrome.storage.sync.set({ bookmarks });

        // Set alarm automatically when saving
        setVideoAlarm(message.video);
      }
    });
  }

  if (message.type === "SET_ALARM" && message.video) {
    setVideoAlarm(message.video);
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name.startsWith("watch_reminder_")) {
    const videoId = alarm.name.replace("watch_reminder_", "");
    chrome.storage.sync.get(["bookmarks"], (data) => {
      const video = (data.bookmarks || []).find((v) => v.id === videoId);
      if (video) {
        console.log("Alarm triggered for video:", video.title);
        chrome.notifications.create(video.id + "_" + Date.now(), {
          type: "basic",
          iconUrl: chrome.runtime.getURL("assets/alarm.png"),
          title: "Video Reminder",
          message: `It's time to watch: ${video.title}`,
          priority: 2,
          silent: false,
          requireInteraction: true,
        });
      }
    });
  }
});

// --- Helper to create/update alarm ---
function setVideoAlarm(video) {
  // Clear old alarm first
  chrome.alarms.clear("watch_reminder_" + video.id, () => {
    // Use seconds for 1 sec testing
    let delay, period;
    if (video.frequency === 0.0167) {
      // Change test frequency to 6 seconds = 0.1 minutes
      delay = 0.1;
      period = 0.1;
    } else {
      delay = video.frequency;
      period = video.frequency;
    }

    chrome.alarms.create("watch_reminder_" + video.id, {
      delayInMinutes: delay,
      periodInMinutes: period,
    });
  });
}
