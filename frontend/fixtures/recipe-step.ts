import type { RecipeStep } from "@/types/recipe";

export const baseStep: RecipeStep = {
  step_number: 1,
  instruction: "Mix the ingredients",
  duration_minutes: null,
  timer_label: null,
  requires_attention: false,
  tips: [],
};
