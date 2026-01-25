"use client";

import { useIsSingleColumnLayout } from "@/hooks/use-is-single-column-layout";
import { MobileLayout } from "@/screens/cook/mobile/layout";
import { DesktopLayout } from "@/screens/cook/desktop/layout";

export default function Home() {
  const isSingleColumn = useIsSingleColumnLayout();

  return isSingleColumn ? <MobileLayout /> : <DesktopLayout />;
}
