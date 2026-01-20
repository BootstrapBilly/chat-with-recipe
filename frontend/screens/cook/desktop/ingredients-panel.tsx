"use client";

import { Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/generated/alert";
import { IngredientsList } from "../components/ingredients-list";
import type { Ingredient } from "@/types/recipe";
import { ScaleServings } from "../components/scale-servings";
import { useIsSingleColumnLayout } from "@/hooks/use-is-single-column-layout";

interface IngredientsPanelProps {
  ingredients: Ingredient[];
  servings: number;
}

export function IngredientsPanel({
  ingredients,
  servings,
}: IngredientsPanelProps) {
  const isSingleColumn = useIsSingleColumnLayout();
  const actionCopy = isSingleColumn ? "Tap" : "Click";
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
          <AlertDescription>{actionCopy} any ingredient to swap it.</AlertDescription>
        </Alert>
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        <IngredientsList ingredients={ingredients} />
      </div>

      <div className="border-t border-border p-4">
        <ScaleServings servings={servings} />
      </div>
    </div>
  );
}
