import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

export const gpt4oMini = new ChatOpenAI({
  modelName: "gpt-4o-mini",
});