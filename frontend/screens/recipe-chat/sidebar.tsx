"use client";

import type { Recipe } from "@/types/recipe";

interface RecipeSidebarProps {
  recipe: Recipe;
}

export function RecipeSidebar({ recipe }: RecipeSidebarProps) {
  const timeMeta = [
    `${recipe.servings} servings`,
    recipe.prep_time_minutes ? `${recipe.prep_time_minutes}m prep` : null,
    recipe.cook_time_minutes ? `${recipe.cook_time_minutes}m cook` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <aside className="w-80 border-r border-border overflow-auto p-6">
      <h1 className="text-title mb-1">{recipe.title}</h1>
      {timeMeta ? (
        <p className="text-sm text-muted-foreground mb-6">{timeMeta}</p>
      ) : null}

      <section className="mb-6">
        <h2 className="text-subtitle mb-3">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients?.map((ing, i) => (
            <li key={`${ing.name}-${i}`} className="text-sm">
              {[ing.quantity, ing.unit, ing.name].filter(Boolean).join(" ")}
              {ing.preparation && ` (${ing.preparation})`}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-subtitle mb-3">Steps</h2>
        <ol className="space-y-3">
          {recipe.steps?.map((step) => (
            <li key={step.step_number} className="text-sm">
              <span className="font-medium">{step.step_number}.</span>{" "}
              {step.instruction}
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
