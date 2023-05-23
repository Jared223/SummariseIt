const express = require('express');
const axios = require('axios');
const PDFParser = require('pdf-parse');
const cheerio = require('cheerio');
const SummarizerManager = require("node-summarizer").SummarizerManager;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // for parsing application/json

app.post('/summarise', async (req, res) => {
  const url = req.body.url;

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    let text;

    if (url.endsWith('.pdf')) {
      try {
        const dataBuffer = Buffer.from(response.data, 'binary');
        const data = await PDFParser(dataBuffer);
        text = data.text;
      } catch (error) {
        console.error('Failed to parse PDF:', error);
        return res.status(500).send('Failed to parse PDF. Please try another document.');
      }
    } else {
      const html = response.data;
      const $ = cheerio.load(html);
      text = $('body').text();
    }

    // Summarize the text
    const summarizer = new SummarizerManager(text, 5); // Summarize to 5 sentences
    const summary = await summarizer.getSummaryByRank();

    // Send the summary back to the client
    res.send(summary);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching or summarizing the document.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
