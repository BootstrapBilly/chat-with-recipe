"use client";

import { useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { useCopilotChat } from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
import { Button } from "@/components/generated/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/generated/dialog";
import { Input } from "@/components/generated/input";

interface ScaleServingsProps {
  servings: number;
}

export function ScaleServings({ servings }: ScaleServingsProps) {
  const { appendMessage, isLoading } = useCopilotChat();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(servings));

  const parsedValue = Number.parseInt(value, 10);
  const currentValue = Number.isFinite(parsedValue) ? parsedValue : servings;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setValue(String(servings));
    }
  }

  function handleDecrement() {
    setValue(String(Math.max(1, currentValue - 1)));
  }

  function handleIncrement() {
    setValue(String(Math.max(1, currentValue + 1)));
  }

  async function handleSubmit() {
    const nextServings = Math.max(1, currentValue);
    if (nextServings === servings) {
      setOpen(false);
      return;
    }

    await appendMessage(
      new TextMessage({
        role: MessageRole.User,
        content: `Scale the recipe to ${nextServings} servings.`,
      }),
    );
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="outline"
        className="h-12 px-3 gap-1.5"
        onClick={() => handleOpenChange(true)}
      >
        <Users className="h-5 w-5" />
        <span className="text-sm font-medium">{servings}</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust servings</DialogTitle>
            <DialogDescription>
              How many people are you cooking for?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={isLoading || currentValue <= 1}
                aria-label="Decrease servings"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min={1}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="text-center"
                inputMode="numeric"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={isLoading}
                aria-label="Increase servings"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading || currentValue < 1}
            >
              {isLoading ? "Scaling..." : "Update servings"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
