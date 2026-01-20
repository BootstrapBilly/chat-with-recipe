"use client";

import { ListChecks } from "lucide-react";
import { Button } from "@/components/generated/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/generated/sheet";
import type { Ingredient, IngredientCategory } from "@/types/recipe";

interface IngredientsProps {
  ingredients: Ingredient[];
}

const CATEGORY_ORDER: IngredientCategory[] = [
  "produce",
  "protein",
  "dairy",
  "pantry",
  "spice",
  "other",
];

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: "Produce",
  protein: "Protein",
  dairy: "Dairy",
  pantry: "Pantry",
  spice: "Spices",
  other: "Other",
};

export function Ingredients({ ingredients }: IngredientsProps) {
  const groupedIngredients = CATEGORY_ORDER.reduce(
    (acc, category) => {
      const items = ingredients.filter((ing) => ing.category === category);
      if (items.length > 0) acc[category] = items;
      return acc;
    },
    {} as Record<IngredientCategory, Ingredient[]>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <ListChecks className="h-5 w-5" />
          <span className="sr-only">Ingredients</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] px-0 bg-background">
        <div className="px-6 pt-2 pb-6">
          <SheetTitle className="text-2xl font-semibold tracking-tight">
            Ingredients
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground mt-1">
            {ingredients.length} items
          </SheetDescription>
        </div>
        <div className="overflow-auto h-[calc(100%-5rem)] px-6 pb-8">
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
                  {items.map((ing, i) => (
                    <li key={`${ing.name}-${i}`} className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-[15px] text-foreground font-medium">
                          {ing.name}
                        </span>
                        {ing.preparation && (
                          <p className="text-[13px] text-muted-foreground mt-0.5">
                            {ing.preparation}
                          </p>
                        )}
                      </div>
                      <span className="text-[15px] text-muted-foreground tabular-nums pt-px">
                        {[ing.quantity, ing.unit].filter(Boolean).join(" ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
