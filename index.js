const express = require('express');
const app = express();
const port = 3000;
const scrapeData = require('./scraper');

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
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
