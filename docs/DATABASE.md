# FinQuest Database Documentation

## Entity Relationship Schema

The database uses PostgreSQL with the following core tables:

- `users`: User profiles, level, XP, streak count, currency, income baseline.
- `categories`: System default and user custom spending categories.
- `transactions`: Logged financial entries with amounts, types, payment methods, anomaly flags.
- `budgets` & `budget_categories`: Monthly/weekly spending targets per category.
- `goals` & `goal_contributions`: Savings goals, deadline targets, and contribution logs.
- `challenges` & `user_challenges`: System challenges, duration, XP rewards, user progress.
- `achievements` & `user_achievements`: Achievement master taxonomy and unlocked records.
- `xp_transactions`: Audit log of XP rewards and sources.
- `financial_health_scores`: Historical 0-100 financial health scores and factor breakdowns.
