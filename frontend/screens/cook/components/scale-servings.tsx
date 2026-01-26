"use client";

import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/generated/button";
import { Input } from "@/components/generated/input";
import { useRecipe } from "@/hooks/use-recipe";

export function ScaleServings() {
  const { recipe, scaleServings } = useRecipe();
  const servings = recipe?.servings ?? 0;
  const [value, setValue] = useState(String(servings));

  if (!recipe) return null;

  const handleDecrement = () => {
    const next = Math.max(1, servings - 1);
    if (next === servings) return;
    setValue(String(next));
    scaleServings(next);
  };

  const handleIncrement = () => {
    const next = Math.max(1, servings + 1);
    setValue(String(next));
    scaleServings(next);
  };

  const handleChange = (input: HTMLInputElement) => {
    setValue(input.value);
    const parsedValue = Number.parseInt(input.value, 10);
    if (Number.isFinite(parsedValue)) {
      scaleServings(Math.max(1, parsedValue));
    }
  };

  const handleBlur = () => {
    if (!value.trim()) {
      setValue(String(servings));
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span>Servings</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={servings <= 1}
          aria-label="Decrease servings"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min={1}
          value={value}
          onChange={(event) => handleChange(event.currentTarget)}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
          className="h-10 w-16 text-center"
          inputMode="numeric"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          aria-label="Increase servings"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
