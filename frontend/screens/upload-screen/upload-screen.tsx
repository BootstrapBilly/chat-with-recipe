"use client";

import { FileUpload } from "@/components/file-upload";

interface UploadScreenProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  error?: string | null;
}

export function UploadScreen({
  onFileSelect,
  isUploading,
  error = null,
}: UploadScreenProps) {
  return (
    <div className="flex h-screen items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-title">Recipe Companion</h1>
          <p className="text-muted-foreground">Upload a recipe to get started</p>
        </div>
        <FileUpload onFileSelect={onFileSelect} isUploading={isUploading} />
        {error ? (
          <p className="text-sm text-destructive text-center">{error}</p>
        ) : null}
      </div>
    </div>
  );
}
