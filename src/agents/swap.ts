import { gpt4oMini } from "../utils/model";
import { agentKit } from "../utils/solanaAgent";
import { solanaAgentState } from "../utils/state";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SolanaFetchPriceTool, SolanaBalanceTool, SolanaTokenDataTool, SolanaTokenDataByTickerTool, SolanaTradeTool } from "solana-agent-kit/dist/langchain";
import { swapTool } from "../tools/swap";
import { SystemMessage } from "@langchain/core/messages";

const swapPrompt = new SystemMessage(
    `You are an expert in swap tokens on Solana. You will receive instructions in JSON format and execute swap transactions using the available tools.

    Steps:
    1. Gather enough information to execute the swap
    2. Execute the swap
    3. Return and explain the execution result

    Important Rules:
    - Check inputAmount twice
    - Set at least 1000 basis points (10%) slippage tolerance, since meme coin price is volatile.

    Example:
    1. Buy a meme token with 1 SOL
    {
      "direction": "buy",
      "inputMint": "So11111111111111111111111111111111111111112",
      "inputAmount": 1,
      "outputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    }

    2. Sell a meme token for SOL, query <meme token balance> first, then inputAmount=calc(inputPercentage * <meme token balance>)
    {
      "direction": "sell",
      "inputMint": "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
      "inputPercentage": 0.5,
      "inputAmount": "calc(0.5 * <meme token balance>)",
      "outputMint": "So11111111111111111111111111111111111111112",
    }
    `
  )

const swapAgent = createReactAgent({
  stateModifier: swapPrompt,
  llm: gpt4oMini,
  tools: [new SolanaTradeTool(agentKit), new SolanaFetchPriceTool(agentKit), new SolanaBalanceTool(agentKit), new SolanaTokenDataTool(agentKit), new SolanaTokenDataByTickerTool(agentKit)],
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


