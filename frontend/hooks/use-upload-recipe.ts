import { useMutation } from "@tanstack/react-query";
import { uploadRecipe } from "@/lib/api";
import type { Recipe } from "@/types/recipe";

interface UploadResponse {
  threadId: string;
  runId: string;
  state: {
    recipe: Recipe | null;
    document_text: string | null;
  };
}

export function useUploadRecipe() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const response = await uploadRecipe(file);
      return response;
    },
  });
}
