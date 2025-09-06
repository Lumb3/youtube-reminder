chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_BOOKMARK") {
    chrome.storage.sync.get(["bookmarks"], (data) => {
      let bookmarks = data.bookmarks || [];
      // prevent duplicates
      if (!bookmarks.some((v) => v.id === message.video.id)) {
        bookmarks.push(message.video);
        chrome.storage.sync.set({ bookmarks });
      }
    });
  }
});

// Notifications scheduler
function checkReminders() {
  chrome.storage.sync.get(["bookmarks"], (data) => {
    const bookmarks = data.bookmarks || [];
    bookmarks.forEach((video) => {
      const notifId = `yt-${video.id}`;
      chrome.notifications.create(notifId, {
        type: "basic",
        iconUrl: video.thumbnail,
        title: "YouTube Reminder",
        message: `Time to watch: ${video.url}`,
        priority: 2
      });
    });
  });
}

// run every 30 min (or dynamic later)
chrome.alarms.create("ytReminder", { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "ytReminder") {
    checkReminders();
  }
});
