# Frontend decisions

- **Centralized `useRecipe`**: avoids prop drilling, keeps thread/steps/upload logic in one place.
- **Next.js (App Router)**: fast DX, file‑based routing, server/client split fits the app’s upload + chat flow. Need server for copilotkit.
- **React Query**: minimal async state for uploads; caching + retries without extra boilerplate.
- **CopilotKit + AG‑UI**: keeps agent state + chat runtime consistent with the backend.
- **Shadcn UI**: composable polished components out of the box for free; we **don’t edit generated files**, we compose on top in `screens/` + `components/`.
- **Mobile vs desktop layouts**: single‑column vs 3‑column UI optimizes space and focus.
- **Vitest**: fast, Vite‑native tests; good fit for component/unit tests.
- **Style guide**: Keep design consistent, modern and cool
- **`renderWithProviders`**: avoid wrapping tests in providers all the time
