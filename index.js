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

    const response = await axios.get(apiUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    const media = response.data.videoInfo.medias.find(media => media.type === type);
    if (!media) throw new Error(`${type} not found`);

    const randomFileName = generateRandomFileName(type === 'video' ? 'mp4' : 'mp3');
    const filePath = path.join(__dirname, 'public', randomFileName);

    // Use stream to write file
    const writer = fs.createWriteStream(filePath);
    const mediaStream = await axios({
        method: 'get',
        url: media.url,
        responseType: 'stream',
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });

    await new Promise((resolve, reject) => {
        mediaStream.data.pipe(writer);
        mediaStream.data.on('error', reject);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });

    // Auto delete file after 5 minutes
    setTimeout(() => {
        fs.unlink(filePath, err => {
            if (err) console.error(`Failed to delete ${randomFileName}:`, err.message);
            else console.log(`${randomFileName} deleted after 5 minutes`);
        });
    }, 5 * 60 * 1000);

    return `https://test-production-e28b.up.railway.app/${randomFileName}`;
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

        // Immediately let user know we're working
        console.log('Fetching audio...');
        const audioFileUrl = await fetchMedia(req.query.url, 'audio');
        res.json({ success: true, audioFileUrl, quality: '360p', title: 'Unknown', author: 'RUbish' });
    } catch (error) {
        console.error('Audio error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
