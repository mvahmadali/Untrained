// File: train.js

const { loadVectorStore } = require("./vectorStore");
const {
  CheerioWebBaseLoader,
} = require("langchain/document_loaders/web/cheerio");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { neon } = require("@neondatabase/serverless");

const sql = neon(
  process.env.DATABASE_URL,
);

exports.train = async (dataUrls) => {
  // Ensure the trained_urls table exists
  await sql(
    `CREATE TABLE IF NOT EXISTS trained_urls (url TEXT UNIQUE NOT NULL)`,
  );
  const trainingResult = [];
  // Initialize a NeonPostgres instance to store embedding vectors
  const vectorStore = await loadVectorStore();
  try {
    const executeAsyncOperation = (element) => {
      return new Promise(async (resolve) => {
        try {
          const result = await sql(
            `SELECT COUNT(*) FROM trained_urls WHERE url = $1`,
            [element],
          );
          if (result[0].count > 0) return resolve();
          // Load LangChain's Cheerio Loader to parse the webpage
          const loader = new CheerioWebBaseLoader(element);
          const data = await loader.load();
          // Split the page into biggest chunks
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 3096,
            chunkOverlap: 128,
          });
          // Split the chunks into docs and train
          const tempSplitDocs = await textSplitter.splitDocuments(data);
          await vectorStore.addDocuments(tempSplitDocs);
          // Add to the global training array
          await sql(`INSERT INTO trained_urls (url) VALUES ($1)`, [element]);
          resolve();
        } catch (e) {
          // console.log('Faced error as below while training for', element)
          console.log(e.message || e.toString());
          console.log("Failed to train chatbot on", element);
          trainingResult.push({ name: element, trained: false });
        }
      });
    };
    await Promise.all(
      dataUrls.map((element) => executeAsyncOperation(element)),
    );
  } catch (e) {
    console.log(e.message || e.toString());
  }
};


// This has an added functionality to force retraining of one Url so that we can visualize the console logs that werent appearing previously.
// File: train.js

// const { loadVectorStore } = require("./vectorStore");
// const {
//   CheerioWebBaseLoader,
// } = require("langchain/document_loaders/web/cheerio");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// const { neon } = require("@neondatabase/serverless");

// // Connecting to Neon PostgreSQL
// const sql = neon(process.env.DATABASE_URL);

// exports.train = async (dataUrls) => {
//   // Ensure the trained_urls table exists
//   await sql(
//     `CREATE TABLE IF NOT EXISTS trained_urls (url TEXT UNIQUE NOT NULL)`,
//   );
//   const trainingResult = [];

//   // Initialize a NeonPostgres instance to store embedding vectors
//   const vectorStore = await loadVectorStore();

//   try {
//     const executeAsyncOperation = (element) => {
//       return new Promise(async (resolve) => {
//         try {
//           // Check if the URL is already trained
//           const result = await sql(
//             `SELECT COUNT(*) FROM trained_urls WHERE url = $1`,
//             [element],
//           );

//           // Force processing for a specific URL (e.g., the first URL in the list)


//           // const forceProcessUrl = dataUrls[0]; // Change this to the URL you want to debug
//           // if (result[0].count > 0 && element !== forceProcessUrl) {
//           //   console.log("URL already trained, skipping:", element);
//           //   return resolve();
//           // } else if (element === forceProcessUrl) {
//           //   console.log("Forcing processing for URL:", element);
//           // }



//           // Load LangChain's Cheerio Loader to parse the webpage
//           const loader = new CheerioWebBaseLoader(element);
//           const data = await loader.load();

//           // Log the loaded data
//           console.log("Data loaded for URL:", element);
//           console.log("Data:", JSON.stringify(data, null, 2)); // Print the entire data object

//           // Split the page into biggest chunks
//           const textSplitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 3096,
//             chunkOverlap: 128,
//           });

//           // Split the chunks into docs and train
//           const tempSplitDocs = await textSplitter.splitDocuments(data);

//           // Log the split documents
//           console.log("Documents after splitting for URL:", element);
//           console.log("tempSplitDocs:", JSON.stringify(tempSplitDocs, null, 2)); // Print the entire tempSplitDocs object

//           // Add documents to the vector store
//           await vectorStore.addDocuments(tempSplitDocs);

//           // Add to the global training array
//           await sql(`INSERT INTO trained_urls (url) VALUES ($1)`, [element]);

//           console.log("Successfully trained on URL:", element);
//           resolve();
//         } catch (e) {
//           console.log(e.message || e.toString());
//           console.log("Failed to train chatbot on", element);
//           trainingResult.push({ name: element, trained: false });
//           resolve();
//         }
//       });
//     };

//     // Process all URLs in parallel
//     await Promise.all(
//       dataUrls.map((element) => executeAsyncOperation(element)),
//     );
//   } catch (e) {
//     console.log(e.message || e.toString());
//   }
// };
