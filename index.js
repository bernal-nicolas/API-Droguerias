const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const scrapeData = require('./scraper');

// Use cors middleware
app.use(cors());

app.get('/search', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).send('Query parameter is required');
  }

  try {
    const data = await scrapeData(query);
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});