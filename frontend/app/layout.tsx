"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";
import { ErrorBoundary } from "@/components/error-boundary";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <CopilotKit runtimeUrl="/api/copilotkit" agent="recipe_agent">
            <ErrorBoundary>{children}</ErrorBoundary>
          </CopilotKit>
        </QueryClientProvider>
      </body>
    </html>
  );
}
