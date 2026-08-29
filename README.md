# FinQuest — AI-Powered Gamified Personal Finance Platform

> **"Turn responsible financial habits into a game."**

FinQuest is a full-stack, production-grade personal finance application that combines expense tracking, budget caps, savings goal automation, financial analytics, AI-powered coaching, and a RPG-style gamification engine.

---

## 🌟 Key Features

- 🎮 **RPG Gamification Engine**: Earn XP for logging transactions, building daily streaks, completing budget challenges, and reaching savings milestones. Dynamic level progression curve (`500 * (level-1)^1.4`).
- 🤖 **AI Financial Coach & Quick-Add**: Natural language transaction parser ("Swiggy 450" ➔ Food & Dining, ₹450) and conversational assistant anchored in verified database metrics.
- 🛡️ **Financial Health Score**: Deterministic 0-100 score across Savings Ratio (25 pts), Budget Adherence (25 pts), Consistency (20 pts), Goal Pace (20 pts), and Spending Stability (10 pts).
- 📊 **Financial Analytics**: Recharts line, donut, and bar charts for cash flow trends and month-over-month comparisons.
- 🎯 **Savings Goals & Budgets**: Automated required weekly/monthly saving rate calculations and visual overspend alerts.
- 🤖 **Machine Learning**: Time-series spending prediction via Ridge Regression and transaction anomaly detection via Isolation Forest.
- 🔒 **Security & Privacy**: JWT authentication with refresh tokens, password hashing, user data isolation, JSON/CSV data export, and complete account deletion.

---

## 🚀 Quick Start with Docker

```bash
# 1. Clone repository & configure environment
cp .env.example .env

# 2. Launch containerized application
docker-compose up -d --build

# 3. Seed development data
docker-compose exec backend python -m database.seed
```

Access services:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **FastAPI API Docs**: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)

---

## 🔑 Demo Credentials

- **Demo Account**: `demo@finquest.com` | Password: `password123`
- **Admin Account**: `admin@finquest.com` | Password: `admin123`

---

## 📂 Project Structure

```
FinQuest/
├── frontend/             # Next.js 14, TypeScript, Tailwind CSS, Lucide, Recharts
├── backend/              # FastAPI, Pydantic v2, SQLAlchemy ORM, JWT Security
├── ai/                   # Multi-provider LLM abstraction + zero-latency fallback engine
├── ml/                   # Scikit-learn Ridge Regression & Isolation Forest
├── database/             # Alembic migrations & comprehensive seed script
├── docker/               # Dockerfiles & docker-compose configuration
└── docs/                 # Architecture, API, Database, AI, and Deployment guides
```
