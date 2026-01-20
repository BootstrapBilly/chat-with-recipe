import type { Recipe } from "@/types/recipe";

export const baseRecipe: Recipe = {
  title: "Test Recipe",
  description: null,
  servings: 4,
  original_servings: null,
  prep_time_minutes: 15,
  cook_time_minutes: 30,
  difficulty: "medium",
  cuisine: null,
  dietary_tags: [],
  ingredients: [],
  steps: [],
  source_text: null,
};
