"use client";

import { useCallback, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/generated/alert";
import { useRecipe } from "@/hooks/use-recipe";
import { useUploadRecipe } from "@/hooks/use-upload-recipe";

export function UploadScreen() {
  const { setRecipeContext } = useRecipe();
  const upload = useUploadRecipe();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      upload.mutate(file, {
        onSuccess: (data) => {
          setUploadError(null);
          setRecipeContext(data.state);
        },
        onError: () => {
          setUploadError("We could not upload that document.");
        },
      });
    },
    [upload, setRecipeContext],
  );

  const error = uploadError ?? (upload.error?.message || null);

  return (
    <div className="flex h-screen items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-title">Recipe Companion</h1>
          <p className="text-muted-foreground">Upload a recipe to get started</p>
        </div>
        <FileUpload onFileSelect={handleFileSelect} isUploading={upload.isPending} />
        {error ? (
          <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}
