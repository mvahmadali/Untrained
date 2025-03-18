const { fourtyurls } = require("./data");

const { train } = require("./train");
const { DOMParser } = require("xmldom");
const fs = require("fs").promises;



function makeURLs(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const locElements = xmlDoc.getElementsByTagName("loc");
  return Array.from(locElements).map((element) => element.textContent);
}

// async function scrapeWebsite(url) {
//   const callSitemap = await fetch(new URL("/sitemap.xml", url).toString());
//   // Add your custom scraping logic here
//   const responseSitemap = await callSitemap.text();
//   console.log("responseSitemap", responseSitemap);
//   const sitemapURLs = makeURLs(responseSitemap);
//   console.log("sitemapURLs", sitemapURLs);
//   console.log("Found", sitemapURLs.length, "urls to scrape.");
//   console.log("Training...");
//   /* 
//     Pick the following two sections:
//     Top Vitamins - Pick the first 5 URLs
//     Top Drugs - Pick the first 5 URLs 
//   */
//   await train(sitemapURLs);
//   console.log("Completed training!");
// }


// async function scrapejeffBurkeWebsite(url) {
//   const callSitemap = await fetch(new URL("/sitemap.xml", url).toString());
//   const responseSitemap = await callSitemap.text();
//   console.log("responseSitemap", responseSitemap);
//   const sitemapURLs = makeURLs(responseSitemap);
//   console.log("sitemapURLs", sitemapURLs);
//   console.log("Found", sitemapURLs.length, "urls to scrape.");
//   console.log("Training...");
//   await train(sitemapURLs);
//   console.log("Completed training!");
// }


// async function scrapeWebMdWebsite() {
//   try {
//     // Read the sitemap from the local file system
//     const responseSitemap = await fs.readFile("customSitemap.xml", "utf8");

//     console.log("responseSitemap", responseSitemap);

//     // Extract URLs from the sitemap
//     const sitemapURLs = makeURLs(responseSitemap);
//     console.log("sitemapURLs", sitemapURLs);
//     console.log("Found", sitemapURLs.length, "urls to scrape.");
//     console.log("Training...");

//     await train(sitemapURLs);
//     console.log("Completed training on WebMd!");
//   } catch (error) {
//     console.error("Failed to scrape WebMD sitemap:", error);
//   }
// }


async function scrapeURLs() {
  try {
    console.log("Found", fourtyurls.length, "urls to scrape.");
    console.log("Training on the following URLs:", fourtyurls);

    await train(fourtyurls);

    console.log("Completed training on Everyday Health URLs!");
  } catch (error) {
    console.error("Failed to scrape Everyday Health URLs:", error);
  }
}


// exports.scrapejeffBurkeWebsite = scrapejeffBurkeWebsite;
// exports.scrapeWebMdWebsite = scrapeWebMdWebsite;
exports.scrapeURLs = scrapeURLs;