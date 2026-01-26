import type { Recipe } from "@/types/recipe";

const SCALE_PRECISION = 100;

function roundToTwoDecimals(value: number) {
  return Math.round(value * SCALE_PRECISION) / SCALE_PRECISION;
}

export function scaleRecipe(recipe: Recipe, targetServings: number): Recipe {
  if (recipe.servings === 0 || recipe.servings === targetServings) {
    return recipe;
  }

  const originalServings = recipe.original_servings ?? recipe.servings;
  const scaleFactor = targetServings / originalServings;

  return {
    ...recipe,
    servings: targetServings,
    original_servings: originalServings,
    ingredients: recipe.ingredients.map((ingredient) => {
      const originalQuantity = ingredient.original_quantity ?? ingredient.quantity;
      return {
        ...ingredient,
        original_quantity: originalQuantity,
        quantity:
          originalQuantity != null && originalQuantity !== 0
            ? roundToTwoDecimals(originalQuantity * scaleFactor)
            : null,
      };
    }),
  };
}
