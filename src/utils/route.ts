import { solanaAgentState } from "./state";
import { END } from "@langchain/langgraph";

export const managerRouter = (state: typeof solanaAgentState.State) => {
  const { isSolanaReadQuery, isSolanaWriteQuery } = state;

  if (isSolanaWriteQuery) {
    return "transferSwap";
  } else if (isSolanaReadQuery) {
    return "read";
  } else {
    return END;
  }
};
