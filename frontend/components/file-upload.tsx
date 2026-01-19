"use client";

import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  isUploading?: boolean;
  fileName?: string | null;
}

export function FileUpload({
  onFileSelect,
  onError,
  isUploading = false,
  fileName = null,
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    onDropAccepted: (files) => onFileSelect(files[0]),
    onDropRejected: () => onError?.("Please upload a PDF or TXT file"),
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8",
        "border-2 border-dashed rounded-lg cursor-pointer",
        "transition-colors duration-150",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isDragActive
          ? "border-accent bg-accent/5"
          : "border-border hover:border-muted-foreground"
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <>
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Uploading {fileName}...</p>
        </>
      ) : fileName ? (
        <>
          <FileText className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Drop a recipe file here</p>
            <p className="text-xs text-muted-foreground mt-1">PDF or TXT</p>
          </div>
        </>
      )}
    </div>
  );
}
