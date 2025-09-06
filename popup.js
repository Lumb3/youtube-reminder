// --- Page Indentifier Utils ---
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
  div.className = "video-item";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.marginBottom = "12px";
  div.style.padding = "8px";
  div.style.border = "1px solid #ddd";
  div.style.borderRadius = "8px";
  div.style.backgroundColor = "#f9f9f9";
  div.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
  div.style.gap = "12px";

  // Thumbnail
  const img = document.createElement("img");
  img.src = video.thumbnail;
  img.alt = video.title || "Thumbnail";
  img.style.width = "80px";
  img.style.height = "45px";
  img.style.objectFit = "cover";
  img.style.borderRadius = "4px";
  img.style.cursor = "pointer";
  img.addEventListener("click", () => {
    chrome.tabs.create({ url: video.url });
  });

  // Info container (title + dropdown)
  const info = document.createElement("div");
  info.style.display = "flex";
  info.style.flexDirection = "column";
  info.style.flexGrow = "1";

  // Title
  const title = document.createElement("p");
  title.textContent = video.title || "Untitled video";
  title.style.margin = "0 0 6px 0";
  title.style.fontSize = "14px";
  title.style.fontWeight = "600";
  title.style.color = "#111";
  title.style.wordBreak = "break-word"; // wrap long titles

  // Frequency dropdown
  const select = document.createElement("select");
  [15, 30, 60, 120].forEach((min) => {
    const opt = document.createElement("option");
    opt.value = min;
    opt.textContent = `${min} min`;
    if (video.frequency === min) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("change", (e) => {
    video.frequency = parseInt(e.target.value, 10);
    updateVideo(video);
  });
  select.style.width = "90px";
  select.style.padding = "2px 4px";
  select.style.borderRadius = "4px";
  select.style.border = "1px solid #ccc";

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "❌";
  removeBtn.title = "Remove video";
  removeBtn.style.background = "transparent";
  removeBtn.style.border = "none";
  removeBtn.style.cursor = "pointer";
  removeBtn.style.fontSize = "18px";
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
