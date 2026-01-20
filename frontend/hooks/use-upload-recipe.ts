import { useMutation } from "@tanstack/react-query";
import { uploadRecipe } from "@/lib/api";
import type { RecipeContext } from "@/types/recipe";

interface UploadResponse {
  threadId: string;
  runId: string;
  state: RecipeContext;
}

export function useUploadRecipe() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const response = await uploadRecipe(file);
      return response;
    },
  });
}
