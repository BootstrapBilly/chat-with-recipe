import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { useIsSingleColumnLayout } from "./use-is-single-column-layout";

function HookProbe() {
  const isSingleColumn = useIsSingleColumnLayout();
  return <div data-testid="value">{String(isSingleColumn)}</div>;
}

describe("useIsSingleColumnLayout", () => {
  let currentMql: {
    matches: boolean;
    addEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => void;
    removeEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => void;
  } | null = null;
  let listener: ((event: MediaQueryListEvent) => void) | null = null;

  beforeEach(() => {
    listener = null;
    currentMql = null;
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => {
      currentMql = {
        matches: false,
        addEventListener: (_event, cb) => {
          listener = cb;
        },
        removeEventListener: () => {
          listener = null;
        },
      };
      return currentMql;
    }));
  });

  it("returns true when the media query matches", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => {
      currentMql = {
        matches: true,
        addEventListener: (_event, cb) => {
          listener = cb;
        },
        removeEventListener: () => {
          listener = null;
        },
      };
      return currentMql;
    }));

    render(<HookProbe />);

    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("true"),
    );
  });

  it("returns false when the media query does not match", async () => {
    render(<HookProbe />);

    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("false"),
    );
  });

  it("updates when the media query changes", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => {
      currentMql = {
        matches: false,
        addEventListener: (_event, cb) => {
          listener = cb;
        },
        removeEventListener: () => {
          listener = null;
        },
      };
      return currentMql;
    }));

    render(<HookProbe />);

    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("false"),
    );

    if (currentMql && listener) {
      currentMql.matches = true;
      listener({ matches: true } as MediaQueryListEvent);
    }

    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("true"),
    );
  });
});
