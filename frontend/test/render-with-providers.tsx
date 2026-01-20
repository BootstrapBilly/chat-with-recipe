import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CopilotKit } from "@copilotkit/react-core";
import type { ReactElement, ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CopilotKit runtimeUrl="/api/copilotkit" agent="recipe_agent">
        {children}
      </CopilotKit>
    </QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: Providers, ...options });
}
