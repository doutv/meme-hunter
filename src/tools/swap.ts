import { agentKit } from "../utils/solanaAgent";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { PublicKey } from "@solana/web3.js";
import { rl } from "../index";

export const swapTool = tool(
  async ({ outputMint, inputAmount, inputMint, slippageBps }) => {
    try {
      const outputMintAddress = new PublicKey(outputMint);
      const inputMintAddress = new PublicKey(inputMint);

      console.log(inputAmount, outputMintAddress, inputMintAddress);
      
      const confirmation = await new Promise(resolve => {
        rl.question(`\nReady to swap ${inputAmount} tokens from ${inputMint} to ${outputMint}. Please confirm the trade (yes/no): `, answer => {
          rl.close();
          resolve(answer.trim().toLowerCase() === 'yes');
        });
      });

      if (!confirmation) {
        return "Trade cancelled by user";
      }

      const tx = await agentKit.trade(
        outputMintAddress,
        inputAmount,
        inputMintAddress,
        slippageBps,
      );
      return tx;
    } catch (error) {
      console.error(error);
      return "error";
    }
  },
  {
    name: "swap",
    description:
      "Swap tokens from one token to the other using Jupiter exchange",
    schema: z.object({
      outputMint: z
        .string()
        .describe("The mint address of destination token to be swapped to"),
      inputAmount: z
        .number()
        .describe(
          "the input amount of the token to be swapped in decimals",
        ),
      inputMint: z.string().describe("The mint address of the origin token"),
      slippageBps: z
        .number()
        .describe("The maximum slippage tolerance in basis points (100 = 1%)"),
    }),
  },
);

