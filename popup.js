document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const videoList = document.getElementById("videoList");
  const clearAllBtn = document.getElementById("clearAll");

  // 🔧 Add this missing declaration
  let videoReminders = {};

  // Placeholder: list of sample videos
  let videos = [
    {
      title: "How to learn JavaScript",
      thumbnail: "https://img.youtube.com/vi/oHg5SJYRHA0/mqdefault.jpg",
      timestamp: Date.now() - 3600000,
    },
    {
      title: "Top 10 AI Projects",
      thumbnail: "https://img.youtube.com/vi/2vjPBrBU-TM/mqdefault.jpg",
      timestamp: Date.now() - 86400000,
    },
  ];

  function timeAgo(ts) {
    const diff = Date.now() - ts;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `Bookmarked ${days} day(s) ago`;
    if (hours > 0) return `Bookmarked ${hours} hour(s) ago`;
    return `Bookmarked ${minutes} min(s) ago`;
  }

  function renderList(filter = "") {
    videoList.innerHTML = "";
    videos
      .filter((video) =>
        video.title.toLowerCase().includes(filter.toLowerCase())
      )
      .forEach((video) => {
        const li = document.createElement("li");
        li.className = "video-card";

        const isActive = videoReminders[video.title]?.active;
        const remindClass = isActive ? "active-reminder" : "";

        li.innerHTML = `
        <img src="${video.thumbnail}" alt="Thumbnail" />
        <div class="video-info">
          <p class="title">${video.title}</p>
          <span class="time-ago">${timeAgo(video.timestamp)}</span>
        </div>
        <button class="remind-btn ${remindClass}">⏰</button>
      `;

        const remindBtn = li.querySelector(".remind-btn");
        remindBtn.addEventListener("click", () => {
          showReminderMenu(video.title, remindBtn);
        });

        videoList.appendChild(li);
      });
  }
  function showReminderMenu(title, buttonEl) {
    const current = videoReminders[title] || { active: false, interval: null };

    const input = prompt(
      current.active
        ? `Reminder is active.\nCurrent interval: ${current.interval} mins\n\nEnter new interval in minutes (or leave blank to turn OFF):`
        : `Set a reminder for "${title}".\nEnter interval in minutes:`,
      current.active ? current.interval : "60"
    );

    if (input === null) return; // Cancelled

    if (input.trim() === "") {
      // Turn OFF reminder
      videoReminders[title] = { active: false, interval: null };
      buttonEl.classList.remove("active-reminder");
      alert(`Reminder turned OFF for "${title}"`);
      return;
    }

    const mins = parseInt(input);
    if (isNaN(mins) || mins <= 0) {
      alert("Invalid number. Please enter a positive number.");
      return;
    }

    // Turn ON reminder
    videoReminders[title] = { active: true, interval: mins };
    buttonEl.classList.add("active-reminder");
    alert(`Reminder set every ${mins} min(s) for "${title}"`);
  }

  searchInput.addEventListener("input", (e) => {
    renderList(e.target.value);
  });

  clearAllBtn.addEventListener("click", () => {
    if (confirm("Clear all bookmarked videos?")) {
      videos = [];
      renderList();
    }
  });

  renderList();
});
