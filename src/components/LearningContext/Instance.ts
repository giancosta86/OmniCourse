import { createContext, useContext } from "react";

import { LearningContext } from "./Context";

export const learningContext = createContext<LearningContext | null>(null);

export function useLearningContext(): LearningContext {
  return useContext(learningContext) as LearningContext;
}
