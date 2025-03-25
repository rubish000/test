const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;
app.get("/", (req,res)=>{
  res.send("ok2")
})
app.use(express.static(path.join(__dirname, 'public')));

app.get('/get-video', async (req, res) => {
  const videoUrl = 'https://www.youtube.com/watch?v=aAwlNGohFUs';
  const apiKey = 'rubish69';

  const apiUrl = `https://www.rubish.infy.uk/rubish/youtube-search?query=${encodeURIComponent(videoUrl)}&apikey=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    const url = response.data.videoInfo.medias[0].url;
    const pp = await axios.get(url, { responseType: "arraybuffer" })
    
    const videoFilePath = path.join(__dirname, 'public', 'video.mp4'); 
    fs.writeFileSync(videoFilePath, response.data)
      const videoFileUrl = `https://ytb-apiz-69-seven.vercel.app/video.mp4`;
      res.json({ videoFileUrl });
  } catch (error) {
    console.error('Error fetching data from Rubish API:', error);
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
        
