"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/generated/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/generated/dialog";
import { Input } from "@/components/generated/input";
import type { Ingredient } from "@/types/recipe";

interface SubstituteIngredientProps {
  ingredient: Ingredient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (ingredient: Ingredient, substitute: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function SubstituteIngredient({
  ingredient,
  open,
  onOpenChange,
  onSubmit,
  value,
  onValueChange,
  isLoading = false,
  error = null,
}: SubstituteIngredientProps) {
  if (!ingredient) return null;

  function handleSubmit() {
    if (!ingredient) return;
    onSubmit(ingredient, value.trim());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Substitute ingredient</DialogTitle>
          <DialogDescription>
            What would you like to swap {ingredient.name} with?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Swapping:</span>{" "}
            {[ingredient.quantity, ingredient.unit, ingredient.name]
              .filter(Boolean)
              .join(" ")}
            {ingredient.preparation ? ` (${ingredient.preparation})` : ""}
          </div>
          <Input
            placeholder="Leave blank to let the assistant decide"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              "Substitute"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
