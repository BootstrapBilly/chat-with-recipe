/**
 * Recipe types matching backend/src/models.py exactly.
 * Keep in sync with Python Pydantic models.
 *
 * If I had time, I would generate an open api spec from the python backend and inherit these types for free
 */

export type IngredientCategory =
  | "produce"
  | "protein"
  | "dairy"
  | "pantry"
  | "spice"
  | "other";

export interface Ingredient {
  name: string;
  quantity: number | null;
  original_quantity?: number | null;
  unit: string | null;
  preparation: string | null;
  category: IngredientCategory;
  substitutes: string[];
}

export interface RecipeStep {
  step_number: number;
  instruction: string;
  duration_minutes: number | null;
  timer_label: string | null;
  requires_attention: boolean;
  tips: string[];
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Recipe {
  title: string;
  description: string | null;
  servings: number;
  original_servings: number | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  difficulty: Difficulty;
  cuisine: string | null;
  dietary_tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  source_text: string | null;
}

export interface RecipeContext {
  document_text: string | null;
  recipe: Recipe | null;
  current_step: number;
  scaled_servings: number | null;
  checked_ingredients: string[];
  cooking_started: boolean;
}
