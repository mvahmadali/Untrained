const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { question } = require("./ask");
const { scrapejeffBurkeWebsite } = require("./scrape");
const { scrapeWebMdWebsite } = require("./scrape");
const { scrapeURLs } = require("./scrape");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to trigger scraping and training
//  When the /train Route is Called
// This works similarly to trainOnWebsite(), except:
// It can be triggered on demand instead of running at startup.
// It allows training on different sources dynamically (e.g., passing a new URL).
app.get('/train', async (req, res) => {
  try {
    await scrapeWebsite("https://jeffburke.substack.com");
    // await scrapeWebMDWebsite("https://www.webmd.com");
    res.send('Training completed!');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Endpoint to handle user questions
app.post('/ask', async (req, res) => {
  try {
    const answer = await question(req.body.question);
    res.send({ answer });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Function to train on website
async function trainOnjeffBurkeWebsite() {
  try {
    await scrapejeffBurkeWebsite("https://jeffburke.substack.com");
    console.log('Training completed on server start!');
  } catch (err) {
    console.error('Training failed on server start:', err);
  }
}


// Function to train on WebMD's manually uploaded sitemap
async function trainOnWebMdWebsite() {
  try {
    await scrapeWebMdWebsite();
    console.log('Training on WebMD completed on server start!');
  } catch (err) {
    console.error('Training on WebMD failed on server start:', err);
  }
}

async function trainOnScrapedURLs() {
  try {
    await scrapeURLs();
    console.log("Training on scraped URLs completed on server start!");
  } catch (err) {
    console.error("Training on scraped URLs failed on server start:", err);
  }
}




app.listen(PORT, () => {
  // trainOnjeffBurkeWebsite()
  // trainOnWebMdWebsite()
  trainOnScrapedURLs()

  console.log(`Server is running on port ${PORT}`);
});