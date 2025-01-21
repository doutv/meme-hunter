import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

export const gpt4o = new ChatOpenAI({
  modelName: "deepseek-chat",
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.deepseek.com"
});

export const gpt4oMini = new ChatOpenAI({
  modelName: "deepseek-chat",
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://api.deepseek.com"
});
