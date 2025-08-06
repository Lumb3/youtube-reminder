import { getCurrentTab } from "./utils.js";

function addVideoCard(video) {
  const list = document.getElementById("videoList");

  const li = document.createElement("li");
  li.className = "video-card";

  li.innerHTML = `
    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="Thumbnail" />
    <div class="video-info">
      <p class="title">${video.title}</p>
      <span class="time-ago">${video.timeAgo}</span>
    </div>
    <button class="remind-btn">⏰</button>
  `;

  const remindBtn = li.querySelector(".remind-btn");
  remindBtn.addEventListener("click", () => {
    const isActive = remindBtn.classList.toggle("active-reminder");

    if (isActive) {
      remindBtn.title = "Reminder active";
      const newTime = prompt("Set repetition (e.g., every 1h, daily):", video.repetition || "daily");
      if (newTime) {
        video.repetition = newTime;
      }
    } else {
      remindBtn.title = "Reminder off";
    }

    console.log(`Reminder for "${video.title}": ${isActive ? "ON" : "OFF"}, Repeats: ${video.repetition || "N/A"}`);
  });

  list.appendChild(li);
}

document.addEventListener("DOMContentLoaded", async () => {
  const errorEl = document.querySelector(".error");
  console.log("popup.js loaded ✅");
  try {
    const currentTab = await getCurrentTab();

    if (!currentTab || !currentTab.url) {
      console.log("Tab or URL not found");
      if (errorEl) errorEl.textContent = "Could not get the current tab.";
      return;
    }

    console.log("Current Tab URL:", currentTab.url);

    const isYoutubeVideo = currentTab.url.includes("youtube.com/watch");
    let currentVideoId = null;

    if (isYoutubeVideo) {
      const queryParams = new URLSearchParams(currentTab.url.split("?")[1]);
      currentVideoId = queryParams.get("v");
    }

    if (!isYoutubeVideo || !currentVideoId) {
      console.log("Not a YouTube video page");
      if (errorEl) errorEl.textContent = "This is not a YouTube video page.";
      return;
    }

    const demoVideo = {
      id: currentVideoId,
      title: "Video you're watching now",
      timeAgo: "Just now",
      repetition: null
    };

    addVideoCard(demoVideo);
  } catch (err) {
    console.error("Error getting tab:", err);
    if (errorEl) errorEl.textContent = "Something went wrong.";
  }
});

document.getElementById("clearAll").addEventListener("click", () => {
  document.getElementById("videoList").innerHTML = "";
});
