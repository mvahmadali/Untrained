const { pull } = require("langchain/hub");
const { ChatOpenAI } = require("@langchain/openai");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { loadVectorStore } = require("./vectorStore");
const { createRetrievalChain } = require("langchain/chains/retrieval");

async function question(input) {
  const vectorStore = await loadVectorStore();
  const retrievalQAChatPrompt = await pull("langchain-ai/retrieval-qa-chat");
  console.log("retrievalQAChatPrompt", retrievalQAChatPrompt)
  const llm = new ChatOpenAI();
  const retriever = vectorStore.asRetriever();
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt: retrievalQAChatPrompt,
  });
  const retrievalChain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });
  const chainOutput = await retrievalChain.invoke({ input });
  console.log(chainOutput.answer);
  return chainOutput.answer;
}

exports.question = question;
