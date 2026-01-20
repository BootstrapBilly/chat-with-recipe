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
  useCopilotChat,
  useCopilotContext,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { MessageRole, TextMessage } from "@copilotkit/runtime-client-gql";
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
  const { appendMessage } = useCopilotChat();
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

  const handleNextStep = useCallback(async () => {
    if (!recipeContext?.recipe) return;
    await appendMessage(
      new TextMessage({
        role: MessageRole.User,
        content: "Next step.",
      }),
    );
  }, [appendMessage, recipeContext]);

  const recipe = recipeContext?.recipe ?? null;
  const totalSteps = recipe?.steps.length ?? 0;
  const currentStep = (recipeContext?.current_step ?? 0) + 1;
  const isComplete = recipe ? currentStep >= totalSteps : false;

  const value = useMemo<RecipeStore>(
    () => ({
      recipeContext,
      recipe,
      currentStep,
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
      currentStep,
      totalSteps,
      isComplete,
      threadId,
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
