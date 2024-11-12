const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash access key

// Endpoint to fetch and save a unique image
app.get('/get-placeholder-image', async (req, res) => {
  try {
    // Fetch a random marketing image from Unsplash
    const response = await fetch(`https://api.unsplash.com/photos/random?query=marketing&client_id=${unsplashAccessKey}`);
    const data = await response.json();

    if (data && data.urls && data.urls.regular) {
      const imageUrl = data.urls.regular;
      const imageName = `${data.id}.jpg`; // Use the image ID from Unsplash for a unique name
      const imagePath = path.join(__dirname, 'images', imageName);

      // Download and save the image locally
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();
      fs.writeFileSync(imagePath, imageBuffer);

      res.json({ imagePath: `/images/${imageName}` });
    } else {
      res.status(500).json({ error: 'Failed to fetch image from Unsplash' });
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

