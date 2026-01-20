import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

vi.mock("@copilotkit/react-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@copilotkit/react-core")>();

  return {
    ...actual,
    CopilotKit: ({ children }: { children: React.ReactNode }) => children,
    useCopilotChat: () => ({ appendMessage: vi.fn() }),
    useCopilotReadable: () => {},
    useCopilotContext: () => ({ setThreadId: vi.fn() }),
    useCoAgent: () => ({
      state: {},
      setState: vi.fn(),
      running: false,
    }),
  };
});
