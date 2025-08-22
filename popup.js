import { getCurrentTab } from "./utils.js";

const onPlay = async () => {};
const showBookmarks = () => {};

document.addEventListener("DOMContentLoaded", async () => {
  // Validating the website
  const currentTab = await getCurrentTab();
  if (!currentTab || !currentTab.url) return;
  const queryParams = new URLSearchParams(currentTab.url.split("?")[1]);
  const currentVideo = queryParams.get("v");
  if (currentTab.url.includes("youtube.com/watch") && currentVideo) {
    console.log("You are on a Youtube video page");
    showBookmarks();
  } else {
    window.location.href = "not-youtube.html";
  }

  // const videoList = document.getElementById("video-list");
  // const frequencySelect = document.getElementById("frequency");
  // const saveSettingsBtn = document.getElementById("saveSettings");

  // // Remove video UI only (no backend yet)
  // videoList.addEventListener("click", (e) => {
  //   if (e.target.classList.contains("remove-btn")) {
  //     e.target.parentElement.remove();
  //   }
  // });

  // // Load saved settings (mockup for UI only)
  // if (localStorage.getItem("notifFrequency")) {
  //   frequencySelect.value = localStorage.getItem("notifFrequency");
  // }

  // // Save settings (UI only)
  // saveSettingsBtn.addEventListener("click", () => {
  //   const selected = frequencySelect.value;
  //   localStorage.setItem("notifFrequency", selected);
  //   alert(
  //     selected === "off"
  //       ? "Notifications turned off."
  //       : `Notifications set: every ${selected} minutes`
  //   );
  // });
});
