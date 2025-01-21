import "dotenv/config"; // Read .env file, Place this at the top of the file
import { SolanaFetchPriceTool, SolanaBalanceTool } from "solana-agent-kit/dist/langchain";
import { agentKit } from "../utils/solanaAgent";

const fetchPriceTool = new SolanaFetchPriceTool(agentKit);
const wsolPrice = await fetchPriceTool.invoke("So11111111111111111111111111111111111111112");
console.log("wSOL price: ", wsolPrice);

const trumpPrice = await fetchPriceTool.invoke("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN");
console.log("TRUMP price: ", trumpPrice);

const balanceTool = new SolanaBalanceTool(agentKit);
const balance = await balanceTool.invoke("");
console.log("My SOL balance: ", balance);