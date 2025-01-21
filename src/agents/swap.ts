import { gpt4oMini } from "../utils/model";
import { agentKit } from "../utils/solanaAgent";
import { solanaAgentState } from "../utils/state";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SolanaTransferTool } from "solana-agent-kit/dist/langchain";
import { swapTool } from "../tools/swap";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { tokenList } from "../helper/tokenList";

const swapPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an agent that is an expert in Solana transactions, specialized in token swaps. You can execute these transactions using the available tools based on user input.

    For swaps:
    - User must specify the input token, output token, and amount to swap
    - Input and output tokens must be different

    Known tokens:
    ${tokenList}
    
    Example amounts:
    If you say "0.01 SOL", I will use exactly 0.01 (not 0.010 or 0.0100)
    If you say "1.234 USDC", I will use exactly 1.234 (not 1.23 or 1.2340)
    stable coin slippage is 200 bps
    meme coin slippage is 3000 bps
    `,
  ],
  new MessagesPlaceholder("messages"),
]);

const swapAgent = createReactAgent({
  stateModifier: swapPrompt,
  llm: gpt4oMini,
  tools: [new SolanaTransferTool(agentKit), swapTool],
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


