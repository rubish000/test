const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.send('Server is running');
});

function generateRandomFileName(extension) {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
}

async function fetchMedia(videoUrl, type, req) {
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
    const filePath = path.join(publicDir, randomFileName);

    setImmediate(() => {
        axios({
            method: 'get',
            url: media.url,
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }).then(mediaStream => {
            const writer = fs.createWriteStream(filePath);
            mediaStream.data.pipe(writer);

            writer.on('finish', () => {
                console.log(`${randomFileName} downloaded successfully.`);
            });

            writer.on('error', (err) => {
                console.error(`Error writing file ${randomFileName}:`, err.message);
            });

            setTimeout(() => {
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(`Failed to delete ${randomFileName}:`, err.message);
                    } else {
                        console.log(`${randomFileName} deleted after 5 minutes`);
                    }
                });
            }, 5 * 60 * 1000);
        }).catch(error => {
            console.error('Error during file download:', error.message);
        });
    });

    return `${req.protocol}://${req.get('host')}/${randomFileName}`;
}

app.get('/get-video', async (req, res) => {
    try {
        if (!req.query.url) return res.status(400).json({ error: 'Missing video URL' });
        const videoFileUrl = await fetchMedia(req.query.url, 'video', req);
        res.json({ success: true, videoFileUrl, author: 'RUbish' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/get-audio', async (req, res) => {
    try {
        if (!req.query.url) return res.status(400).json({ error: 'Missing video URL' });
        const audioFileUrl = await fetchMedia(req.query.url, 'audio', req);
        res.json({ success: true, audioFileUrl, quality: '360p', title: 'Unknown', author: 'RUbish' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
