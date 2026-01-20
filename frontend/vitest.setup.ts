import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

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
