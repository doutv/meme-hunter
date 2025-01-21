import { SolanaFetchPriceTool, SolanaBalanceTool } from "solana-agent-kit/dist/langchain";
import { agentKit } from "../utils/solanaAgent";

const fetchPriceTool = new SolanaFetchPriceTool(agentKit);
const solPrice = await fetchPriceTool.invoke("So11111111111111111111111111111111111111112");
console.log("SOL price: ", solPrice);
const wsolPrice = await fetchPriceTool.invoke("So11111111111111111111111111111111111111112");
console.log("wSOL price: ", wsolPrice);

const balanceTool = new SolanaBalanceTool(agentKit);
const balance = await balanceTool.invoke("");
console.log("My SOL balance: ", balance);

