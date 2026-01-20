"use client";

import { useEffect, useRef, useState } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { IngredientItem } from "./ingredient-item";
import { SubstituteIngredient } from "./substitute-ingredient";
import {
  CATEGORY_LABELS,
  groupIngredientsByCategory,
} from "./ingredients-utils";
import type { Ingredient, IngredientCategory } from "@/types/recipe";

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const { appendMessage, isLoading } = useCopilotChat();
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [swapValue, setSwapValue] = useState("");
  const [swapError, setSwapError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const isLoadingRef = useRef(isLoading);
  const isDialogOpenRef = useRef(isDialogOpen);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    isDialogOpenRef.current = isDialogOpen;
  }, [isDialogOpen]);

  const groupedIngredients = groupIngredientsByCategory(ingredients);

  function handleIngredientClick(ingredient: Ingredient) {
    setSwapValue("");
    setSelectedIngredient(ingredient);
    setIsDialogOpen(true);
  }

  async function waitForSwapCompletion() {
    const startedAt = Date.now();
    while (isLoadingRef.current && Date.now() - startedAt < 15000) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

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
      await waitForSwapCompletion();
      if (isDialogOpenRef.current) {
        setIsDialogOpen(false);
      }
      setIsSwapping(false);
    } catch (error) {
      setIsSwapping(false);
      setSwapError(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
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
    </>
  );
}
