"use client";

import { useState } from "react";
import {
  useCoAgent,
  useCopilotContext,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useIsSingleColumnLayout } from "@/hooks/use-is-single-column-layout";
import { useUploadRecipe } from "@/hooks/use-upload-recipe";
import { UploadScreen } from "@/screens/upload-screen/upload-screen";
import { MobileLayout } from "@/screens/cook/mobile/layout";
import { DesktopLayout } from "@/screens/cook/desktop/layout";
import { EMPTY_RECIPE_CONTEXT } from "@/fixtures/recipe-context";
import type { RecipeContext } from "@/types/recipe";

export default function Home() {
  const [recipeContext, setRecipeContext] = useState<RecipeContext | null>(
    null,
  );
  const [threadId, setLocalThreadId] = useState<string | null>(null);
  const isSingleColumn = useIsSingleColumnLayout();
  const upload = useUploadRecipe();
  const { setThreadId } = useCopilotContext();

  useCoAgent<RecipeContext>({
    name: "recipe_agent",
    state: recipeContext ?? EMPTY_RECIPE_CONTEXT,
    setState: (next) =>
      setRecipeContext((prev) => {
        const resolved =
          typeof next === "function" ? next(prev ?? EMPTY_RECIPE_CONTEXT) : next;
        return {
          ...resolved,
          recipe: resolved.recipe
            ? {
                ...resolved.recipe,
                ingredients: [...resolved.recipe.ingredients],
                steps: [...resolved.recipe.steps],
              }
            : null,
        };
      }),
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

  function handleNextStep() {
    setRecipeContext((prev) => {
      if (!prev || !prev.recipe) return prev;
      const nextStep = prev.current_step + 1;
      if (nextStep > prev.recipe.steps.length) return prev;
      return { ...prev, current_step: nextStep };
    });
  }

  const recipe = recipeContext?.recipe;
  const error = upload.error?.message || null;

  if (!recipe && isSingleColumn) {
    return (
      <UploadScreen
        onFileSelect={handleFileSelect}
        isUploading={upload.isPending}
        error={error}
      />
    );
  }

  if (!recipe) {
    return (
      <DesktopLayout
        recipe={null}
        currentStep={0}
        threadId={threadId}
        onNextStep={handleNextStep}
        uploadState={{
          onFileSelect: handleFileSelect,
          isUploading: upload.isPending,
          error,
        }}
      />
    );
  }

  if (!isSingleColumn) {
    return (
      <DesktopLayout
        recipe={recipe}
        currentStep={recipeContext?.current_step ?? 0}
        threadId={threadId}
        onNextStep={handleNextStep}
        uploadState={{
          onFileSelect: handleFileSelect,
          isUploading: upload.isPending,
          error,
        }}
      />
    );
  }

  return (
    <MobileLayout
      recipe={recipe}
      currentStep={recipeContext?.current_step ?? 0}
      threadId={threadId}
      onNextStep={handleNextStep}
    />
  );
}
