"use client";

import { Clock, ChefHat } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface Props {
  recipe: Recipe;
  currentStep: number;
  totalSteps: number;
}

export function Header({ recipe }: Props) {
  return (
    <header className="px-4 py-4 border-b border-border">
      <h1 className="text-lg font-semibold">{recipe.title}</h1>

      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {recipe.prep_time_minutes}m prep
        </span>

        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {recipe.cook_time_minutes}m cook
        </span>

        <span className="flex items-center gap-1">
          <ChefHat className="h-4 w-4" />
          {recipe.difficulty}
        </span>
      </div>
    </header>
  );
}
