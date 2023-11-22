const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/getRandomIslamicImage', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.unsplash.com/photos/random?query=islam',
      {
        headers: {
          Authorization: `1q8k6NFn7txRLd-nWzS16wxX3fUk0DpB1fOYzYER_Ys`, // Replace with your Unsplash API key
        },
      }
    );
    const data = await response.json();

    if (data.urls && data.urls.regular) {
      res.json({ imageUrl: data.urls.regular });
    } else {
      console.error('Invalid response format from Unsplash API:', data);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error fetching random Islamic image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
