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

// Function to open random video on button click
function openRandomVideo() {
  if (!videoIds.length) {
    alert("Video list not loaded yet. Please wait a moment.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * videoIds.length);
  const videoId = videoIds[randomIndex];
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  window.open(url, "_blank");
}

// Attach click handler to button
document.getElementById('launchButton').addEventListener('click', openRandomVideo);
