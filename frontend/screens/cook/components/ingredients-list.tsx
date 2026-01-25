"use client";

import { useState } from "react";
import { IngredientItem } from "./ingredient-item";
import { SubstituteIngredient } from "./substitute-ingredient";
import {
  CATEGORY_LABELS,
  groupIngredientsByCategory,
} from "./ingredients-utils";
import type { Ingredient, IngredientCategory } from "@/types/recipe";
import { useRecipe } from "@/hooks/use-recipe";

export function IngredientsList() {
  const { recipe } = useRecipe();
  const ingredients = recipe?.ingredients ?? [];
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const groupedIngredients = groupIngredientsByCategory(ingredients);

  function handleIngredientClick(ingredient: Ingredient) {
    setSelectedIngredient(ingredient);
    setIsDialogOpen(true);
  }

  return (
    <>
      <div className="space-y-8">
        {Object.entries(groupedIngredients).map(([category, items]) => (
          <section key={category}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                {CATEGORY_LABELS[category as IngredientCategory]}
              </h3>
              <div className="flex-1 h-px bg-border" />
            </div>
            <ul className="space-y-4">
              {items.map((ingredient, i) => (
                <IngredientItem
                  key={`${ingredient.name}-${i}`}
                  ingredient={ingredient}
                  onSelect={handleIngredientClick}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {isDialogOpen && selectedIngredient && (
        <SubstituteIngredient
          ingredient={selectedIngredient}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
}
