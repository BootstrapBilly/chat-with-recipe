"use client";

import type { Ingredient } from "@/types/recipe";

interface IngredientItemProps {
  ingredient: Ingredient;
  onSelect: (ingredient: Ingredient) => void;
}

export function IngredientItem({ ingredient, onSelect }: IngredientItemProps) {
  return (
    <li className="group flex justify-between items-start gap-4">
      <button
        type="button"
        className="flex-1 min-w-0 text-left rounded-md px-2 py-1 -mx-2 -my-1 transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        onClick={() => onSelect(ingredient)}
      >
        <span className="text-[15px] text-foreground font-medium transition-colors group-hover:text-foreground group-hover:underline">
          {ingredient.name}
        </span>
        {ingredient.preparation && (
          <p className="text-[13px] text-muted-foreground mt-0.5 transition-colors group-hover:text-foreground/70">
            {ingredient.preparation}
          </p>
        )}
      </button>
      <span className="text-[15px] text-muted-foreground tabular-nums pt-px transition-colors group-hover:text-foreground/80">
        {[ingredient.quantity, ingredient.unit].filter(Boolean).join(" ")}
      </span>
    </li>
  );
}
