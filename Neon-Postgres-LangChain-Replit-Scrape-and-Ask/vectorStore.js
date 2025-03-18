// File: vectorStore.js

const { OpenAIEmbeddings } = require("@langchain/openai");
const { NeonPostgres } = require("@langchain/community/vectorstores/neon");

// Initialize an embeddings instance
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize a NeonPostgres instance to store embedding vectors
exports.loadVectorStore = async () => {
  return await NeonPostgres.initialize(embeddings, {
    connectionString: process.env.DATABASE_URL,
  });
};