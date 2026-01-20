"use client";

import { useEffect, useState } from "react";

const SINGLE_COLUMN_QUERY = "(max-width: 1024px)";

export function useIsSingleColumnLayout() {
  const [isSingleColumn, setIsSingleColumn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(SINGLE_COLUMN_QUERY);
    const updateMatch = () => setIsSingleColumn(mediaQuery.matches);

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    return () => {
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, []);

  return isSingleColumn;
}
