import { gpt4oMini } from "../utils/model";
import { agentKit } from "../utils/solanaAgent";
import { solanaAgentState } from "../utils/state";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SolanaFetchPriceTool, SolanaBalanceTool, SolanaTokenDataTool, SolanaTokenDataByTickerTool } from "solana-agent-kit/dist/langchain";
import { swapTool } from "../tools/swap";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const swapPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert in buying and selling tokens on Solana. You can execute these transactions using the available tools based on user input.
    Input and output tokens must be different
    SOL mint address: So11111111111111111111111111111111111111112, decimal: 9
    Set high slippage (3000 bps) for meme coins
    `,
  ],
  new MessagesPlaceholder("messages"),
]);

const swapAgent = createReactAgent({
  stateModifier: swapPrompt,
  llm: gpt4oMini,
  tools: [swapTool, new SolanaFetchPriceTool(agentKit), new SolanaBalanceTool(agentKit), new SolanaTokenDataTool(agentKit), new SolanaTokenDataByTickerTool(agentKit)],
});

export const swapNode = async (
  state: typeof solanaAgentState.State,
) => {
  const { messages } = state;

  const result = await swapAgent.invoke({
    messages,
  });

  return result;
};


