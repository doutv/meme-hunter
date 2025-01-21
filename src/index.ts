import { GraphBubbleUp, StateGraph } from "@langchain/langgraph";
import { solanaAgentState } from "./utils/state";
import { swapNode } from "./agents/swap";
import { managerNode } from "./agents/manager";
import { readNode } from "./agents/readAgent";
import { START, END } from "@langchain/langgraph";
import { managerRouter } from "./utils/route";
import { HumanMessage } from "@langchain/core/messages";

const workflow = new StateGraph(solanaAgentState)
  .addNode("manager", managerNode)
  .addNode("swap", swapNode)
  .addNode("read", readNode)
  .addEdge(START, "manager")
  .addConditionalEdges("manager", managerRouter)
  .addEdge("swap", END)
  .addEdge("read", END);

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
