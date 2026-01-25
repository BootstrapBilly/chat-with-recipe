"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import { UploadScreen } from "@/screens/upload-screen/upload-screen";
import { IngredientsPanel } from "./ingredients-panel";
import { StepsPanel } from "./steps-panel";
import { RecipeHeader } from "../components/recipe-header";
import { useRecipe } from "@/hooks/use-recipe";

export function DesktopLayout() {
  const { recipe, threadId } = useRecipe();

  if (!recipe) {
    return <UploadScreen />;
  }

  return (
    <div className="grid h-screen overflow-hidden grid-cols-[320px_minmax(0,1fr)_360px] bg-background">
      <IngredientsPanel />

      <div className="flex h-full flex-col min-h-0">
        <RecipeHeader recipe={recipe} />

        <div className="flex-1 min-h-0 overflow-hidden">
          <CopilotChat
            key={threadId}
            className="h-full overflow-y-auto"
            labels={{
              initial: `Ask me anything about "${recipe.title}"`,
            }}
          />
        </div>
      </div>

      <StepsPanel />
    </div>
  );
}
