"use client";

import { Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/generated/alert";
import { IngredientsList } from "../components/ingredients-list";
import { ScaleServings } from "../components/scale-servings";
import { useRecipe } from "@/hooks/use-recipe";

export function IngredientsPanel() {
  const { recipe } = useRecipe();
  const ingredients = recipe?.ingredients ?? [];
  return (
    <div className="flex h-full flex-col border-r border-border bg-background">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {ingredients.length} items
        </p>
        <Alert className="mt-4 border-blue-200 bg-blue-50 text-blue-900">
          <Info className="text-blue-500" />
          <AlertTitle>Quick swap</AlertTitle>
          <AlertDescription>Click any ingredient to swap it.</AlertDescription>
        </Alert>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <IngredientsList />
      </div>

      <div className="border-t border-border p-4">
        <ScaleServings />
      </div>
    </div>
  );
}
