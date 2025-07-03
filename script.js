let videoIds = [];

// Load JSON file once when page loads
fetch('videoIds.json')
  .then(response => response.json())
  .then(data => {
    videoIds = data;
  })
  .catch(error => {
    console.error("Error loading video IDs:", error);
    alert("Failed to load video list.");
  });

// Function to embed random video
function embedRandomVideo() {
  if (!videoIds.length) {
    alert("Video list not loaded yet. Please wait a moment.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * videoIds.length);
  const videoId = videoIds[randomIndex];

  const videoContainer = document.getElementById('videoContainer');
  videoContainer.innerHTML = `<iframe width="800" height="450" style="display:block; margin-bottom: 30px;" src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>`;

  // Show the Next button once a video is playing
  document.getElementById('nextButton').style.display = 'inline-block';
}

// Initial Launch button click handler
document.getElementById('launchButton').addEventListener('click', () => {
  embedRandomVideo();
});

// Next button click handler
document.getElementById('nextButton').addEventListener('click', () => {
  embedRandomVideo();
});
// Regex-based YouTube video ID validator
function isValidYouTubeUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)[\w\-]{11}/;
  return regex.test(url);
}

// Handle form reveal
document.getElementById('showFormBtn').addEventListener('click', () => {
  document.getElementById('formContainer').style.display = 'block';
});

// Live validation
document.getElementById('videoInput').addEventListener('input', () => {
  const input = document.getElementById('videoInput').value.trim();
  const isValid = isValidYouTubeUrl(input);

  const submitBtn = document.getElementById('submitVideoBtn');
  submitBtn.disabled = !isValid;
  submitBtn.style.background = isValid
    ? 'linear-gradient(135deg, #00cc66, #00ff99)'
    : '#666';
  submitBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
});

// Submission action
document.getElementById('submitVideoBtn').addEventListener('click', () => {
  const link = document.getElementById('videoInput').value.trim();
  const status = document.getElementById('statusMessage');

  if (!isValidYouTubeUrl(link)) {
    status.textContent = "❌ Invalid YouTube link.";
    return;
  }

  // TEMP: just logs to console (later: email it, store in DB, etc.)
  console.log("📩 New submitted video:", link);
  status.textContent = "✅ Video submitted! Thank you!";
  document.getElementById('videoInput').value = "";
  document.getElementById('submitVideoBtn').disabled = true;
});
