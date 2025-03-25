const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Make sure Express serves static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to fetch YouTube video URL using Rubish API
app.get('/get-video', async (req, res) => {
  const videoUrl = 'https://www.youtube.com/watch?v=aAwlNGohFUs';
  const apiKey = 'rubish69';

  // Construct the URL for Rubish API
  const apiUrl = `https://www.rubish.infy.uk/rubish/youtube-search?query=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;

  try {
    // Make the Axios request to Rubish API
    const response = await axios.get(apiUrl);
    const videoMediaUrl = response.data.videoInfo.medias.url;

    // Example path where the video will be saved
    const videoFilePath = path.join(__dirname, 'public', 'video.mp4'); 

    // Assuming you want to download and save the video from the provided URL
    // (You would need additional code to actually download the video file)
    if (fs.existsSync(videoFilePath)) {
      // If the video file exists, serve it from the public directory
      res.sendFile(videoFilePath);
    } else {
      // If the video isn't found, send the constructed URL for the client to use
      const videoFileUrl = `http://${req.hostname}/video.mp4`; // Video URL from public directory
      res.json({ videoFileUrl });
    }
  } catch (error) {
    console.error('Error fetching data from Rubish API:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
        
