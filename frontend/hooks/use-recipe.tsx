"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  useCoAgent,
  useCopilotContext,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { useUploadRecipe } from "@/hooks/use-upload-recipe";
import { EMPTY_RECIPE_CONTEXT } from "@/fixtures/recipe-context";
import type { Recipe, RecipeContext } from "@/types/recipe";

interface RecipeStore {
  recipeContext: RecipeContext | null;
  recipe: Recipe | null;
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  threadId: string | null;
  isUploading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
  onNextStep: () => void;
}

const RecipeContextValue = createContext<RecipeStore | null>(null);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipeContext, setRecipeContext] = useState<RecipeContext | null>(
    null,
  );
  const [threadId, setLocalThreadId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const upload = useUploadRecipe();
  const { setThreadId } = useCopilotContext();

  useCoAgent<RecipeContext>({
    name: "recipe_agent",
    state: recipeContext ?? EMPTY_RECIPE_CONTEXT,
    setState: (next) =>
      setRecipeContext((prev) => {
        const resolved =
          typeof next === "function"
            ? next(prev ?? EMPTY_RECIPE_CONTEXT)
            : next;
        return resolved;
      }),
  });

  useCopilotReadable({
    description: "Current recipe context",
    value: recipeContext,
  });

  const handleFileSelect = useCallback(
    (file: File) => {
      upload.mutate(file, {
        onSuccess: (data) => {
          setUploadError(null);
          setRecipeContext(data.state);
          setLocalThreadId(data.threadId);
          setThreadId(data.threadId);
        },
        onError: () => {
          setLocalThreadId(null);
          setRecipeContext(null);
          setUploadError("We could not upload that document.");
        },
      });
    },
    [setThreadId, upload],
  );

  const handleNextStep = useCallback(() => {
    setRecipeContext((prev) => {
      if (!prev || !prev.recipe) return prev;
      const nextStep = prev.current_step + 1;
      if (nextStep > prev.recipe.steps.length) return prev;
      return { ...prev, current_step: nextStep };
    });
  }, []);

  const recipe = recipeContext?.recipe ?? null;
  const totalSteps = recipe?.steps.length ?? 0;
  const isComplete = recipe
    ? (recipeContext?.current_step ?? 0) >= totalSteps
    : false;

  const value = useMemo<RecipeStore>(
    () => ({
      recipeContext,
      recipe,
      currentStep: recipeContext?.current_step ?? 0,
      totalSteps,
      isComplete,
      threadId,
      isUploading: upload.isPending,
      error: uploadError ?? (upload.error?.message || null),
      onFileSelect: handleFileSelect,
      onNextStep: handleNextStep,
    }),
    [
      recipeContext,
      recipe,
      threadId,
      totalSteps,
      isComplete,
      upload.isPending,
      upload.error,
      uploadError,
      handleFileSelect,
      handleNextStep,
    ],
  );

  return (
    <RecipeContextValue.Provider value={value}>
      {children}
    </RecipeContextValue.Provider>
  );
}

export function useRecipe() {
  const context = useContext(RecipeContextValue);
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider");
  }
  return context;
}
