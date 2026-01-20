"use client";

import { FileUpload } from "@/components/file-upload";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/generated/alert";

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
          <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTitle>Upload failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}
