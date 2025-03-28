const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Server is running');
});

function generateRandomFileName(extension) {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
}

async function fetchMedia(videoUrl, type) {
    const apiKey = 'rubish69';
    const apiUrl = `https://www.rubish.infy.uk/rubish/youtube-search?query=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;
    
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const media = response.data.videoInfo.medias.find(media => media.type === type);
        if (!media) throw new Error(`${type} not found`);
        
        const mediaData = await axios.get(media.url, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const randomFileName = generateRandomFileName(type === 'video' ? 'mp4' : 'mp3');
        const filePath = path.join(__dirname, 'public', randomFileName);
        fs.writeFileSync(filePath, mediaData.data);

        return `https://test-production-e28b.up.railway.app/${randomFileName}`;
    } catch (error) {
        console.error(`Error fetching ${type}:`, error.message);
        throw new Error(`Failed to fetch ${type}`);
    }
}

app.get('/get-video', async (req, res) => {
    try {
        if (!req.query.url) return res.status(400).json({ error: 'Missing video URL' });
        const videoFileUrl = await fetchMedia(req.query.url, 'video');
        res.json({ success: true, videoFileUrl, author: 'RUbish' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/get-audio', async (req, res) => {
    try {
        if (!req.query.url) return res.status(400).json({ error: 'Missing video URL' });
        const audioFileUrl = await fetchMedia(req.query.url, 'audio');
        res.json({ success: true, downloadLink: audioFileUrl, quality: '360p', title: 'Unknown', author: 'RUbish' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
