document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");

  // Load and apply the saved theme on startup
  chrome.storage.sync.get("darkMode", (result) => {
    const isDark = result.darkMode;
    if (isDark) {
      document.body.classList.add("dark");
      themeToggle.checked = true;
    }
  });

  // Handle toggle switch
  themeToggle.addEventListener("change", () => {
    const darkModeEnabled = themeToggle.checked;
    document.body.classList.toggle("dark", darkModeEnabled);
    chrome.storage.sync.set({ darkMode: darkModeEnabled });
  });
});
