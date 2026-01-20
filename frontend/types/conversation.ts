/**
 * Frontend-only conversation state, stored in localStorage.
 */

import type { RecipeContext } from "./recipe";

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  recipeContext: RecipeContext | null;
}
