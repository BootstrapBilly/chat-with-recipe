# How It Works

## Architecture

```
Frontend (React)              Backend (FastAPI)                LLM (Gemini)
     │                              │                               │
     │  owns state                  │  stateless                    │
     │                              │                               │
     │── POST /upload ─────────────>│                               │
     │                              │── "parse this recipe" ───────>│
     │                              │<── structured Recipe ─────────│
     │<── { threadId, state } ──────│                               │
     │                              │                               │
     │── POST /copilotkit ─────────>│                               │
     │   { message, state }         │── message + state + tools ───>│
     │                              │<── "call scale_recipe(8)" ────│
     │                              │                               │
     │                              │   [execute tool, mutate state]│
     │                              │                               │
     │<── SSE: STATE_SNAPSHOT ──────│                               │
     │<── SSE: TEXT_DELTA ──────────│<── "Done! I've doubled..." ───│
```

**Key concept:** Frontend sends state with each request. Backend mutates it and returns the mutated version. No database, no server-side persistence.

## Features

### Recipe Parsing
Upload a PDF or text file → LLM extracts structured data:
- Title, description, servings, prep/cook time
- Ingredients with quantities, units, and categories
- Numbered steps with timing estimates

### Scaling
> "Double this recipe" / "Make it for 4 people"

Recalculates all ingredient quantities proportionally.

### Substitution
> "I don't have butter, can I use olive oil?"

Fuzzy-matches ingredients (e.g., "parmesan" → "parmesan cheese") and swaps them.

### Step Tracking
> "Next step" / "What's next?"

Advances `current_step`, agent provides context-aware guidance for each step.

### Conversational
General cooking Q&A — ask for tips, timers, or help recovering from mistakes.

## How the LLM Decides Which Tool to Call

The system prompt in `agents.py:190-219` instructs the LLM:

```
ALWAYS call a tool when the user:
- Asks to change servings, scale, double, halve → call scale_recipe
- Asks to substitute, replace, swap ingredient → call substitute_ingredient
- Says "I don't have X" or "can I use Y instead" → call substitute_ingredient
- Says "next step", "done", "what's next" → call update_cooking_progress
```

The LLM receives:
1. This system prompt (rules)
2. Current state (recipe, step, etc.)
3. User message

Then decides: respond with text, call a tool, or both. No regex or intent classifier — just LLM reasoning against the prompt rules.

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/upload` | POST | Upload PDF/text, returns parsed recipe + threadId |
| `/copilotkit` | POST | AG-UI protocol endpoint for chat (SSE stream) |
| `/health` | GET | Health check |

## State

State lives in the frontend via CopilotKit's `useCoAgent` hook.

```typescript
interface RecipeContext {
  document_text: string | null;
  recipe: Recipe | null;
  current_step: number;
  scaled_servings: number | null;
  checked_ingredients: string[];
  cooking_started: boolean;
}
```

## Tools

The LLM decides which tool to call based on user message. Tools mutate state and return it.

### `scale_recipe(target_servings: int)`
Multiplies all ingredient quantities by `target_servings / current_servings`.

### `substitute_ingredient(original: str, substitute: str)`
Fuzzy-matches ingredient name in recipe, replaces with substitute. Uses secondary LLM call for matching (e.g., "parmesan" → "parmesan cheese").

### `update_cooking_progress(current_step?: int, cooking_started?: bool)`
Sets `current_step` or `cooking_started` on state.

## Flow Example

```
User: "Double the recipe"

1. Frontend sends { message: "Double the recipe", state: { recipe: { servings: 4, ... } } }
2. LLM reads message, decides to call scale_recipe(8)
3. Tool executes: recipe.servings = 8, all quantities *= 2
4. Backend streams STATE_SNAPSHOT event with mutated state
5. Frontend receives, useCoAgent updates, React re-renders
```

## Files

| File | Purpose |
|------|---------|
| `backend/src/main.py` | FastAPI app, `/upload` and `/copilotkit` endpoints |
| `backend/src/agents.py` | pydantic-ai agent, tool definitions, prompts |
| `backend/src/models.py` | Pydantic models (Recipe, Ingredient, RecipeContext) |

## Tech Stack

- **Backend:** FastAPI + pydantic-ai + CopilotKit AG-UI
- **LLM:** Google Gemini (configurable via `LLM_MODEL` env var)
- **Protocol:** AG-UI over SSE (not WebSockets)

## Environment Variables

```
GEMINI_API_KEY=your_key_here
LLM_MODEL=gemini-2.0-flash
```
