# Project Instructions

## Frontend Development

When working on any frontend files (`frontend/**`), always read and follow the design system defined in `docs/style-guide.md`.

## Frontend Testing

- Never use as any. Instead use as unknown as expectedType if type casting is required.
- When stubbing/mocking data, use minimum json needed to keep test files lean
- There is a renderWithProviders function which includes the query client provider, and copilotkit provider.
  It's located at frontend\test\render-with-providers.tsx. Never recreate these providers yourself, always use the render-with-providers function.
