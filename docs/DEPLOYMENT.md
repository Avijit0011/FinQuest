# FinQuest Deployment Guide

## Docker Compose Production Deployment

1. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set secret keys and DB passwords:
   ```bash
   cp .env.example .env
   ```

2. **Build and Launch Container Cluster**:
   ```bash
   docker-compose up -d --build
   ```

3. **Seed Database**:
   ```bash
   docker-compose exec backend python -m database.seed
   ```

4. **Verify Running Services**:
   - Next.js Frontend: `http://localhost:3000`
   - FastAPI Backend API: `http://localhost:8000/api/v1`
   - Interactive OpenAPI Docs: `http://localhost:8000/api/v1/docs`
