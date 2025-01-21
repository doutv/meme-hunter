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

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Start the chat
console.log('Chat with me! (type "exit" to quit)');
while (true) {
  const userInput = await new Promise<string>((resolve) => {
    rl.question('You: ', resolve);
  });

  if (userInput.toLowerCase() === 'exit') {
    rl.close();
    break;
  }

  const stream = await graph.stream({
    messages: [new HumanMessage(userInput)],
  });

  for await (const event of stream) {
    const recentMsg = event.messages[event.messages.length - 1];
    console.log(`================================ ${recentMsg._getType()} Message (1) =================================`)
    console.log(recentMsg.content);
  }
}