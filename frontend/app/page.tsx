"use client";

import { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useUploadRecipe } from "@/hooks/use-upload-recipe";
import type { Recipe } from "@/types/recipe";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const upload = useUploadRecipe();

  function handleFileSelect(file: File) {
    upload.mutate(file, {
      onSuccess: (data) => {
        setRecipe(data.state?.recipe || null);
      },
    });
  }

  const error = upload.error?.message || null;

  // Show upload screen if no recipe loaded
  if (!recipe) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-title">Recipe Companion</h1>
            <p className="text-muted-foreground">
              Upload a recipe to get started
            </p>
          </div>
          <FileUpload
            onFileSelect={handleFileSelect}
            isUploading={upload.isPending}
          />
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-title">{recipe.title}</h1>
        <p className="text-sm text-muted-foreground">
          {recipe.servings} servings
          {recipe.prep_time_minutes &&
            ` · ${recipe.prep_time_minutes} min prep`}
          {recipe.cook_time_minutes &&
            ` · ${recipe.cook_time_minutes} min cook`}
        </p>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <section>
            <h2 className="text-subtitle mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ing, i) => (
                <li key={i} className="text-body">
                  {ing.quantity} {ing.unit} {ing.name}
                  {ing.preparation && ` (${ing.preparation})`}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-subtitle mb-3">Steps</h2>
            <ol className="space-y-4">
              {recipe.steps?.map((step, i) => (
                <li key={i} className="text-body">
                  <span className="font-medium">Step {step.step_number}:</span>{" "}
                  {step.instruction}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </div>
  );
}
