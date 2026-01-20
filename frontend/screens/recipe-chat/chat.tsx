"use client";

import { CopilotChat } from "@copilotkit/react-ui";

interface RecipeChatProps {
  threadId: string | null;
  recipeTitle: string;
}

export function RecipeChat({ threadId, recipeTitle }: RecipeChatProps) {
  return (
    <main className="flex-1">
      <CopilotChat
        key={threadId ?? "no-thread"}
        className="h-full"
        labels={{
          initial: `Ask me anything about "${recipeTitle}"! I can help with scaling, substitutions, or cooking tips.`,
        }}
      />
    </main>
  );
}
