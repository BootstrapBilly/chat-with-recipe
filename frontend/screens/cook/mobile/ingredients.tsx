"use client";

import { useState } from "react";
import { Info, ListChecks } from "lucide-react";
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
import { IngredientsList } from "../components/ingredients-list";
import { useRecipe } from "@/hooks/use-recipe";

export function Ingredients() {
  const [isOpen, setIsOpen] = useState(false);
  const { recipe } = useRecipe();
  const ingredients = recipe?.ingredients ?? [];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
          <IngredientsList />
        </div>
      </SheetContent>
    </Sheet>
  );
}
