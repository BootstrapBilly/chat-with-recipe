"use client";

import { useState } from "react";
import {
  useCoAgent,
  useCopilotContext,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useUploadRecipe } from "@/hooks/use-upload-recipe";
import { UploadScreen } from "@/pages/upload-screen/upload-screen";
import { RecipeSidebar } from "@/pages/recipe-chat/sidebar";
import { RecipeChat } from "@/pages/recipe-chat/chat";
import { EMPTY_RECIPE_CONTEXT } from "@/fixtures/recipe-context";
import type { RecipeContext } from "@/types/recipe";

export default function Home() {
  const [recipeContext, setRecipeContext] = useState<RecipeContext | null>(null);
  const [threadId, setLocalThreadId] = useState<string | null>(null);
  const upload = useUploadRecipe();
  const { setThreadId } = useCopilotContext();

  useCoAgent<RecipeContext>({
    name: "recipe_agent",
    state: recipeContext ?? EMPTY_RECIPE_CONTEXT,
    setState: (next) =>
      setRecipeContext((prev) =>
        typeof next === "function" ? next(prev ?? EMPTY_RECIPE_CONTEXT) : next,
      ),
  });

  useCopilotReadable({
    description: "Current recipe context",
    value: recipeContext,
  });

  function handleFileSelect(file: File) {
    upload.mutate(file, {
      onSuccess: (data) => {
        setRecipeContext(data.state);
        setLocalThreadId(data.threadId);
        setThreadId(data.threadId);
      },
    });
  }

  const recipe = recipeContext?.recipe;
  const error = upload.error?.message || null;

  if (!recipe) {
    return (
      <UploadScreen
        onFileSelect={handleFileSelect}
        isUploading={upload.isPending}
        error={error}
      />
    );
  }

  return (
    <div className="flex h-screen">
      <RecipeSidebar recipe={recipe} />
      <RecipeChat threadId={threadId} recipeTitle={recipe.title} />
    </div>
  );
}
