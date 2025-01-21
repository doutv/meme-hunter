import { GraphBubbleUp, StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state";
import { swapNode } from "./agents/swap";
import { START, END } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

const workflow = new StateGraph(solanaAgentState)
  .addNode("swap", swapNode)
  .addEdge(START, "swap")
  .addEdge("swap", END);

export const graph = workflow.compile();

// Create readline interface
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to handle chat interaction
async function chat() {
  while (true) {
    const userInput = await new Promise<string>((resolve) => {
      rl.question('You: ', resolve);
    });

    if (userInput.toLowerCase() === 'exit') {
      rl.close();
      break;
    }

    const result = await graph.invoke({
      messages: [new HumanMessage(userInput)],
    });

    console.log('Assistant:', result);
  }
}

// Start the chat
console.log('Chat with me! (type "exit" to quit)');
chat().catch(console.error);
