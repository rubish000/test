const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('ok22');
});

app.use(express.static(path.join(__dirname, 'public')));

function generateRandomFileName(extension) {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
}

app.get('/get-video', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing video URL' });
  }

  const apiKey = 'rubish69';
  const apiUrl = `https://www.rubish.infy.uk/rubish/youtube-search?query=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const videoDownloadUrl = response.data.videoInfo.medias.find(media => media.type === 'video').url;
    const videoData = await axios.get(videoDownloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const randomVideoFileName = generateRandomFileName('mp4');
    const videoFilePath = path.join(__dirname, 'public', randomVideoFileName);
    fs.writeFileSync(videoFilePath, videoData.data);

    const videoFileUrl = `https://test-production-e28b.up.railway.app/${randomVideoFileName}`;
    res.json({ videoFileUrl });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

app.get('/get-audio', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing video URL' });
  }

  const apiKey = 'rubish69';
  const apiUrl = `https://www.rubish.infy.uk/rubish/youtube-search?query=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const audioDownloadUrl = response.data.videoInfo.medias.find(media => media.type === 'audio').url;
    const audioData = await axios.get(audioDownloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const randomAudioFileName = generateRandomFileName('mp3');
    const audioFilePath = path.join(__dirname, 'public', randomAudioFileName);
    fs.writeFileSync(audioFilePath, audioData.data);

    const audioFileUrl = `https://test-production-e28b.up.railway.app/${randomAudioFileName}`;
    res.json({ audioFileUrl });
  } catch (error) {
    console.error('Error fetching audio:', error);
    res.status(500).json({ error: 'Failed to fetch audio' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
