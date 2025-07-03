let videoIds = [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
let player;
let halfWatched = false;
let watchedIds = JSON.parse(localStorage.getItem('watchedIds') || "[]");

// Update streak display
function updateStreakDisplay() {
  document.getElementById('streak').textContent = streak;
  document.getElementById('bestStreak').textContent = bestStreak;
}

// Load video IDs
fetch('videoIds.json')
  .then(response => response.json())
  .then(data => {
    videoIds = data;
  })
  .catch(error => {
    console.error("Error loading video IDs:", error);
    alert("Failed to load video list.");
  });

// Embed random video avoiding repeats
function embedRandomVideo() {
  if (!videoIds.length) {
    alert("Video list not loaded yet. Please wait a moment.");
    return;
  }

  // Filter videos not watched yet
  const unwatched = videoIds.filter(id => !watchedIds.includes(id));

  if (unwatched.length === 0) {
    alert("🎉 You've watched all available videos!");
    return;
  }

  const randomIndex = Math.floor(Math.random() * unwatched.length);
  const videoId = unwatched[randomIndex];
  halfWatched = false;

  watchedIds.push(videoId);
  localStorage.setItem('watchedIds', JSON.stringify(watchedIds));

  if (player && player.loadVideoById) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player('videoContainer', {
      height: '450',
      width: '800',
      videoId: videoId,
      events: {
        'onStateChange': onPlayerStateChange
      },
      playerVars: {
        autoplay: 1,
        rel: 0
      }
    });
  }

  document.getElementById('nextButton').style.display = 'inline-block';
  showPopup("⚠️ If you skip before watching half, your streak will reset.");
}

// Detect half video watched
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    const checkInterval = setInterval(() => {
      if (player && player.getCurrentTime && player.getDuration) {
        const current = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration > 0 && current >= duration / 2) {
          halfWatched = true;
          clearInterval(checkInterval);
        }
      }
    }, 1000);
  }
}

// Launch first video
document.getElementById('launchButton').addEventListener('click', () => {
  embedRandomVideo();
});

// Next video click logic
document.getElementById('nextButton').addEventListener('click', () => {
  if (!halfWatched) {
    showPopup("⚠️ You skipped too early! Your streak has been reset.");
    streak = 0;
    localStorage.setItem('streak', streak);
    watchedIds = [];             // reset watched on streak loss, so video pool resets
    localStorage.setItem('watchedIds', JSON.stringify(watchedIds));
  } else {
    streak++;
    localStorage.setItem('streak', streak);

    if (streak > bestStreak) {
      bestStreak = streak;
      localStorage.setItem('bestStreak', bestStreak);
    }
  }

  updateStreakDisplay();

  if (streak > 0 && streak % 10 === 0) {
    triggerConfetti();
    showPopup(`🎉 ${streak} Video Streak! You're on fire!`);
    document.getElementById('rewardSound')?.play();
  }

  embedRandomVideo();
});

// Popup message
function showPopup(message) {
  const popup = document.getElementById('popupMessage');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 4000);
}

// Confetti effect
function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#00ffff', '#ff00cc', '#ffff00']
    });
  }
}

// Initial streak update
updateStreakDisplay();

// ------------------- Submit Video Form Logic -------------------

function isValidYouTubeUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w\-]{11}/;
  return regex.test(url);
}

document.getElementById('showFormBtn').addEventListener('click', () => {
  const form = document.getElementById('formContainer');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('videoInput').addEventListener('input', () => {
  const input = document.getElementById('videoInput').value.trim();
  const submitBtn = document.getElementById('submitVideoBtn');
  const isValid = isValidYouTubeUrl(input);

  submitBtn.disabled = !isValid;
  submitBtn.style.background = isValid
    ? 'linear-gradient(135deg, #00cc66, #00ff99)'
    : '#666';
  submitBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
});

document.getElementById('submitVideoBtn').addEventListener('click', () => {
  const link = document.getElementById('videoInput').value.trim();
  const status = document.getElementById('statusMessage');

  if (!isValidYouTubeUrl(link)) {
    status.textContent = "❌ Invalid YouTube link.";
    return;
  }

  // Here you can replace this with an API call or email sending logic
  console.log("📩 New submitted video:", link);
  status.textContent = "✅ Video submitted! Thank you!";
  document.getElementById('videoInput').value = "";
  document.getElementById('submitVideoBtn').disabled = true;
  document.getElementById('submitVideoBtn').style.background = '#666';
  document.getElementById('submitVideoBtn').style.cursor = 'not-allowed';

  // Hide form after short delay
  setTimeout(() => {
    document.getElementById('formContainer').style.display = 'none';
    status.textContent = "";
  }, 3000);
});
