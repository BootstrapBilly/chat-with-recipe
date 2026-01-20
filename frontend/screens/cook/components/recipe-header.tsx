"use client";

import { Clock, ChefHat } from "lucide-react";
import type { Recipe } from "@/types/recipe";

interface RecipeHeaderProps {
  recipe: Recipe;
  variant: "mobile" | "desktop";
}

export function RecipeHeader({ recipe, variant }: RecipeHeaderProps) {
  const prepTime = recipe.prep_time_minutes
    ? `${recipe.prep_time_minutes}m prep`
    : "Unknown prep";
  const cookTime = recipe.cook_time_minutes
    ? `${recipe.cook_time_minutes}m cook`
    : "Unknown cook";
  const difficulty = recipe.difficulty ?? "Unknown";

  if (variant === "desktop") {
    return (
      <header className="border-b border-border px-6 py-5">
        <h1 className="text-xl font-semibold">{recipe.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {prepTime} • {cookTime} • {difficulty}
        </p>
      </header>
    );
  }

  return (
    <header className="px-4 py-4 border-b border-border">
      <h1 className="text-lg font-semibold">{recipe.title}</h1>

      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {prepTime}
        </span>

        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {cookTime}
        </span>

        <span className="flex items-center gap-1">
          <ChefHat className="h-4 w-4" />
          {difficulty}
        </span>
      </div>
    </header>
  );
}
