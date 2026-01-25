"use client";

import { useState } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
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
  onClose: () => void;
}

export function SubstituteIngredient({
  ingredient,
  onClose,
}: SubstituteIngredientProps) {
  const { appendMessage, isLoading } = useCopilotChat({
    id: "ingredients-swap",
  });
  const [value, setValue] = useState("");

  if (!ingredient) return null;

  async function handleSubmit() {
    if (!ingredient) return;
    const substitute = value.trim();
    const content = substitute
      ? `Substitute ${ingredient.name} with ${substitute}.`
      : `Suggest a substitute for ${ingredient.name}.`;

    try {
      await appendMessage(
        new TextMessage({
          role: MessageRole.User,
          content,
        }),
      );
      onClose();
    } catch {
      // CopilotKit shows a toast for async errors; keep the dialog open.
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
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
            onChange={(event) => setValue(event.target.value)}
          />
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
