"use client";

import type { Ingredient } from "@/types/recipe";

interface IngredientItemProps {
  ingredient: Ingredient;
  onSelect: (ingredient: Ingredient) => void;
}

export function IngredientItem({ ingredient, onSelect }: IngredientItemProps) {
  return (
    <li className="flex justify-between items-start gap-4">
      <button
        type="button"
        className="flex-1 min-w-0 text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onSelect(ingredient)}
      >
        <span className="text-[15px] text-foreground font-medium">
          {ingredient.name}
        </span>
        {ingredient.preparation && (
          <p className="text-[13px] text-muted-foreground mt-0.5">
            {ingredient.preparation}
          </p>
        )}
      </button>
      <span className="text-[15px] text-muted-foreground tabular-nums pt-px">
        {[ingredient.quantity, ingredient.unit].filter(Boolean).join(" ")}
      </span>
    </li>
  );
}
