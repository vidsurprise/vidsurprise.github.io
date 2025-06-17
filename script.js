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
