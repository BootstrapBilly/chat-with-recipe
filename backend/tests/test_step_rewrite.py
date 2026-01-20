import types

import pytest

from src import agents
from src.models import RecipeStep


@pytest.mark.asyncio
async def test_rewrite_steps_updates_instructions(monkeypatch, sample_recipe):
    updated_steps = [
        RecipeStep(
            **{
                **step.model_dump(),
                "instruction": step.instruction.replace("tomatoes", "sun-dried tomatoes"),
            }
        )
        for step in sample_recipe.steps
    ]

    class StubAgent:
        async def run(self, _prompt):
            return types.SimpleNamespace(output=updated_steps)

    monkeypatch.setattr(agents, "get_step_rewrite_agent", lambda: StubAgent())

    result = await agents.rewrite_steps_for_substitution(
        sample_recipe, "tomatoes", "sun-dried tomatoes"
    )

    assert result == updated_steps


@pytest.mark.asyncio
async def test_rewrite_steps_falls_back_on_error(monkeypatch, sample_recipe):
    class StubAgent:
        async def run(self, _prompt):
            raise RuntimeError("boom")

    monkeypatch.setattr(agents, "get_step_rewrite_agent", lambda: StubAgent())

    result = await agents.rewrite_steps_for_substitution(
        sample_recipe, "tomatoes", "sun-dried tomatoes"
    )

    assert result == sample_recipe.steps
