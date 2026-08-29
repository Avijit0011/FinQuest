# FinQuest Architecture Document

## Overview

FinQuest is a full-stack gamified personal finance SaaS platform designed with a layered, decoupled architecture.

```
                           ┌────────────────────────────────────────┐
                           │            Next.js Frontend            │
                           │   (App Router, TypeScript, Tailwind)   │
                           └───────────────────┬────────────────────┘
                                               │ HTTP / REST APIs
                                               ▼
                           ┌────────────────────────────────────────┐
                           │            FastAPI Backend             │
                           │     (Controllers, Services, Schemas)   │
                           └──────┬──────────────────┬──────────────┘
                                  │                  │
                      ┌───────────▼───────────┐  ┌───▼───────────────────┐
                      │    PostgreSQL DB      │  │    Redis Cache    │
                      │  (Relational Data)    │  │  (Sessions/Limits)   │
                      └───────────────────────┘  └───────────────────────┘
```

## Layer Responsibilities

1. **Frontend (`frontend/`)**: Next.js React client handling UI states, responsive layout, Framer Motion animations, Recharts analytics, and local fallback state.
2. **Backend Services (`backend/services/`)**:
   - `gamification.py`: XP curve evaluation, streak management, level progression, achievement unlocks.
   - `health_score.py`: Deterministic 0-100 Financial Health Score breakdown across 5 factors.
3. **AI Layer (`ai/`)**: Unified provider abstraction (OpenAI, Gemini, NVIDIA) with zero-latency heuristic rule fallback.
4. **ML Layer (`ml/`)**: Time-series spending prediction via Ridge Regression and transaction anomaly detection via Isolation Forest.
