# FinQuest AI & ML Documentation

## Provider Abstraction
FinQuest supports multi-provider LLM integrations via environment variables:
- `AI_PROVIDER=openai` (OpenAI GPT models)
- `AI_PROVIDER=gemini` (Google Gemini API)
- `AI_PROVIDER=nvidia` (NVIDIA API)
- `AI_PROVIDER=fallback` (Zero-latency heuristic fallback engine)

## Data Isolation & Anti-Hallucination
1. **Verified DB Calculation**: Financial metrics (income, expenses, savings, score) are calculated in python backend code first.
2. **Context Injection**: Verified metrics are injected into system prompts.
3. **No Fabricated Numbers**: LLMs are instructed to explain metrics provided, never to invent financial stats.
