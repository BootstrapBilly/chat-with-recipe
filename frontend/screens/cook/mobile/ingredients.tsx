"use client";

import { useEffect, useState } from "react";
import { Info, ListChecks } from "lucide-react";
import { useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { Button } from "@/components/generated/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/generated/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/generated/sheet";
import { IngredientItem } from "./ingredient-item";
import { SubstituteIngredient } from "./substitute-ingredient";
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
  const { appendMessage, isLoading } = useCopilotChat();
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [swapValue, setSwapValue] = useState("");
  const [swapError, setSwapError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);

  const groupedIngredients = CATEGORY_ORDER.reduce(
    (acc, category) => {
      const items = ingredients.filter((ing) => ing.category === category);
      if (items.length > 0) acc[category] = items;
      return acc;
    },
    {} as Record<IngredientCategory, Ingredient[]>,
  );

  function handleIngredientClick(ingredient: Ingredient) {
    setSwapValue("");
    setSelectedIngredient(ingredient);
    setIsDialogOpen(true);
  }

  useEffect(() => {
    if (isSwapping && !isLoading) {
      setIsSwapping(false);
      setIsDialogOpen(false);
    }
  }, [isLoading, isSwapping]);

  async function handleSubstitute(ingredient: Ingredient, substitute: string) {
    const content = substitute
      ? `Substitute ${ingredient.name} with ${substitute}.`
      : `Suggest a substitute for ${ingredient.name}.`;

    setSwapError(null);
    setIsSwapping(true);
    try {
      await appendMessage(
        new TextMessage({
          role: MessageRole.User,
          content,
        }),
      );
    } catch (error) {
      setIsSwapping(false);
      setSwapError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

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
          <Alert className="mt-4 border-blue-200 bg-blue-50 text-blue-900">
            <Info className="text-blue-500" />
            <AlertTitle>Quick swap</AlertTitle>
            <AlertDescription>Tap any ingredient to swap it.</AlertDescription>
          </Alert>
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
        </div>
      </SheetContent>
      <SubstituteIngredient
        ingredient={selectedIngredient}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubstitute}
        value={swapValue}
        onValueChange={setSwapValue}
        isLoading={isSwapping || isLoading}
        error={swapError}
      />
    </Sheet>
  );
}
