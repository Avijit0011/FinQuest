# FinQuest REST API Reference

All endpoints are prefixed with `/api/v1`.

## Authentication
- `POST /auth/register`: Register new user account.
- `POST /auth/login`: Authenticate and receive JWT access & refresh tokens.
- `GET /auth/me`: Get current authenticated user profile.
- `POST /auth/onboarding`: Complete onboarding preferences.

## Transactions
- `GET /transactions`: List transactions with search, category, type, and pagination filters.
- `POST /transactions`: Log new transaction (triggers +5 XP and streak update).
- `PUT /transactions/{id}`: Update transaction.
- `DELETE /transactions/{id}`: Delete transaction.
- `GET /categories`: List system and custom categories.

## Budgets & Savings Goals
- `GET /budgets`: List budgets with category allocations and spent percentages.
- `POST /budgets`: Create budget.
- `GET /goals`: List savings goals with required weekly/monthly saving rate calculations.
- `POST /goals`: Create savings goal.
- `POST /goals/{id}/contributions`: Add goal contribution.

## Gamification
- `GET /gamification/status`: Level, XP progress %, streak count, unlocked achievements.
- `GET /gamification/challenges`: List user active challenges.
- `POST /gamification/challenges/{id}/join`: Accept challenge.
- `GET /gamification/achievements`: List achievement gallery.

## AI & ML
- `POST /ai/chat`: AI Assistant coach chat with user metrics isolation.
- `POST /ai/categorize-transaction`: Parse natural input ("Swiggy 450").
- `GET /ml/predictions`: Get ML spending forecast & anomaly stats.
