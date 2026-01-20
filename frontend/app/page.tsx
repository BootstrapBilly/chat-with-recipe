"use client";

import { useIsSingleColumnLayout } from "@/hooks/use-is-single-column-layout";
import { RecipeProvider } from "@/hooks/use-recipe";
import { MobileLayout } from "@/screens/cook/mobile/layout";
import { DesktopLayout } from "@/screens/cook/desktop/layout";

export default function Home() {
  const isSingleColumn = useIsSingleColumnLayout();

  return (
    <RecipeProvider>
      {isSingleColumn ? <MobileLayout /> : <DesktopLayout />}
    </RecipeProvider>
  );
}
