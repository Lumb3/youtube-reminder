// --- Page Indentifier Utils --- popoup.js
import { getCurrentTab } from "./utils.js";

// --- Storage Helpers ---
async function getBookmarks() {
  const data = await chrome.storage.sync.get(["bookmarks"]);
  return data.bookmarks || [];
}

async function setBookmarks(bookmarks) {
  await chrome.storage.sync.set({ bookmarks });
}

// --- Update & Remove ---
async function updateVideo(updated) {
  let bookmarks = await getBookmarks();
  bookmarks = bookmarks.map((v) => (v.id === updated.id ? updated : v));
  await setBookmarks(bookmarks);
}

async function removeVideo(id) {
  let bookmarks = await getBookmarks();
  bookmarks = bookmarks.filter((v) => v.id !== id);
  await setBookmarks(bookmarks);
  renderBookmarks();
}

// --- UI Creation ---
function createVideoElement(video) {
  const div = document.createElement("div");
  div.className = "video";

  // Thumbnail
  const img = document.createElement("img");
  img.src = video.thumbnail;
  img.alt = video.title || "Thumbnail";
  img.addEventListener("click", () => {
    chrome.tabs.create({ url: video.url });
  });

  // Info container
  const info = document.createElement("div");
  info.className = "video-info";

  // Title
  const title = document.createElement("p");
  title.textContent = video.title || "Untitled video";

  // Frequency dropdown
  const select = document.createElement("select");
  [1, 5, 10, 30, 60].forEach((min) => {
    // 1 min
    const opt = document.createElement("option");
    if (min === 0.1) opt.textContent = "6 sec (test)";
    else opt.textContent = `${min} min`;
    opt.value = min;
    if (video.frequency === min) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => {
    video.frequency = parseFloat(e.target.value);
    updateVideo(video);

    // Send message to background to set/update the alarm
    chrome.runtime.sendMessage({ type: "SET_ALARM", video });
  });

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.title = "Remove video";
  removeBtn.addEventListener("click", () => {
    removeVideo(video.id);
  });

  // Append children
  info.appendChild(title);
  info.appendChild(select);
  div.appendChild(img);
  div.appendChild(info);
  div.appendChild(removeBtn);

  return div;
}

// --- Render Bookmarks ---
async function renderBookmarks() {
  const videoList = document.getElementById("video-list");
  videoList.innerHTML = "";

  const bookmarks = await getBookmarks();

  if (!bookmarks.length) {
    videoList.textContent = "No saved videos yet.";
    return;
  }

  const fragment = document.createDocumentFragment();
  bookmarks.forEach((video) => {
    fragment.appendChild(createVideoElement(video));
  });

  videoList.appendChild(fragment);
}

// --- Entry Point ---
document.addEventListener("DOMContentLoaded", async () => {
  const currentTab = await getCurrentTab();
  if (!currentTab || !currentTab.url) return;

  const url = new URL(currentTab.url);

  const isWatchLater =
    url.hostname === "www.youtube.com" &&
    url.pathname === "/playlist" &&
    url.searchParams.get("list") === "WL";

  if (isWatchLater) {
    renderBookmarks();
  } else {
    window.location.href = "not-youtube.html";
  }
});
