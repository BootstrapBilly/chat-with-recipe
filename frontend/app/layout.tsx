"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

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
            {children}
          </CopilotKit>
        </QueryClientProvider>
      </body>
    </html>
  );
}
