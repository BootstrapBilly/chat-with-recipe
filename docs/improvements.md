# Improvements

## Swap ingredient refusal signal

Behaviour:

- When an ingredient substitution fails (no match, unsafe substitute, or model refusal), the backend should emit a structured signal that the frontend can display immediately.
- The frontend should show a concise error state explaining this in the substitution modal.

Implementation sketch:

- Backend: extend `RecipeContext` with a transient `last_substitution` object (e.g. `{ status: "success" | "refused" | "not_found", message?: string, original?: string, substitute?: string }`).
- In `substitute_ingredient` tool, populate `last_substitution` before returning `StateSnapshotEvent`.
- When returning a plain string (no match/refusal), include the same `last_substitution` update so the frontend can react without parsing text.
- Frontend: after a swap attempt, read `last_substitution` from state and show a banner/error in the modal; clear it on modal close or next successful swap.

Notes:

- Keep the signal lightweight and ephemeral (do not persist in storage).
- This avoids brittle text heuristics and gives explicit UX for refusals.

## Backend context persistence

Behaviour:

- Persist conversation context on the backend so a thread id can be reused across page refreshes or new sessions.
- Frontend stores only the thread id and reconnects to restore state.

Implementation sketch:

- Backend: store `RecipeContext` (and any agent state) keyed by `thread_id` in a durable store (db or cache).
- Expose a load endpoint or reuse existing thread bootstrap to return the saved state for a given thread id.
- Frontend: read thread id from storage on load and call the backend to hydrate context.

## Multiple recipes history

Behaviour:

- Allow users to revisit historical recipes from the frontend (list of past uploads).
- Selecting a recipe restores its conversation/thread and renders the saved state.

Implementation sketch:

- Backend: persist recipe metadata + thread id + last updated timestamp.
- Frontend: fetch list on load, render a history list, and set current thread id when selecting.

## Model with higher rate limits

https://docs.cloud.google.com/vertex-ai/generative-ai/docs/provisioned-throughput/error-code-429

gemini-2.5-flash-lite seems to be fine.

Behaviour:

- Reduce 429s by using a model/endpoint with higher throughput or provisioned capacity.
- Prefer a model tier or hosting option that supports sustained chat + tool calls without throttling.

Implementation sketch:

- Move to a higher‑throughput model or enable provisioned throughput for Vertex AI.
- Add retry/backoff and user‑visible “busy” state when rate limits are hit.

## Step navigation controls

Behaviour:

- Allow users to go back to a previous step and reset progress.
- Provide a quick "restart" to set step back to 1.

Implementation sketch:

- Backend: use `update_cooking_progress` to set explicit step indices (including decrease/reset).
- Frontend: add back/reset controls and update the UI based on the new current step.

## Deterministic step + scale actions

Behaviour:

- Step progression and scaling should be deterministic (UI-driven), not dependent on the LLM deciding whether to call tools.
- The backend should still receive the updates so it stays in sync with the UI.

Implementation sketch:

- Steps: keep `current_step` updated via explicit state sync or direct tool call, but the UI drives the step index (no LLM inference).
- Scaling: call `scale_recipe` with a concrete `target_servings` from the UI; avoid free-form natural language for scaling intent.

Notes:

- Scaling already looks deterministic in the backend via `scale_recipe`; the improvement is to ensure the UI always invokes it directly through a dedicated endpoint.
