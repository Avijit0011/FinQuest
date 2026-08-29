import os
import json
import re
from typing import Dict, Any, Optional
from backend.config import settings

class AIProviderService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.openai_key = settings.OPENAI_API_KEY
        self.gemini_key = settings.GOOGLE_API_KEY
        self.nvidia_key = settings.NVIDIA_API_KEY

    def categorize_transaction(self, input_text: str) -> Dict[str, Any]:
        """
        Parses text like "Swiggy 450" or "Uber 250" or "Salary 50000" into category, amount, type, description.
        If external LLM is configured, uses LLM; otherwise uses fast heuristic fallback.
        """
        text_lower = input_text.lower().strip()
        
        # 1. Fallback Heuristic Regex Engine (Fast, zero-latency, 100% reliable)
        amount_match = re.search(r'(\d+(?:\.\d{1,2})?)', input_text)
        amount = float(amount_match.group(1)) if amount_match else 0.0

        transaction_type = "expense"
        category = "Shopping & General"
        confidence = 0.85
        description = input_text

        if any(w in text_lower for w in ["salary", "income", "freelance", "dividend", "refund", "bonus"]):
            transaction_type = "income"
            category = "Income & Salary"
        elif any(w in text_lower for w in ["swiggy", "zomato", "restaurant", "food", "dinner", "lunch", "pizza", "coffee", "starbucks", "burger"]):
            category = "Food & Dining"
        elif any(w in text_lower for w in ["uber", "ola", "metro", "bus", "fuel", "petrol", "cab", "auto", "train"]):
            category = "Transportation"
        elif any(w in text_lower for w in ["amazon", "flipkart", "clothes", "myntra", "shopping", "shoes"]):
            category = "Shopping"
        elif any(w in text_lower for w in ["netflix", "spotify", "prime", "youtube", "movie", "cinema"]):
            category = "Entertainment"
        elif any(w in text_lower for w in ["rent", "electricity", "wifi", "bill", "water", "gas", "maintenance"]):
            category = "Bills & Utilities"
        elif any(w in text_lower for w in ["pharmacy", "hospital", "doctor", "medicine", "gym", "health"]):
            category = "Healthcare"

        # Try LLM if key is present
        if self.provider == "openai" and self.openai_key:
            try:
                from langchain_openai import ChatOpenAI
                llm = ChatOpenAI(openai_api_key=self.openai_key, model="gpt-3.5-turbo", temperature=0)
                prompt = f"""Categorize this transaction input into JSON with keys: category, amount, transaction_type ('income' or 'expense'), description, confidence (0.0 to 1.0).
Categories options: Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Healthcare, Income & Salary, Other.
Input: '{input_text}'
JSON:"""
                resp = llm.invoke(prompt)
                parsed = json.loads(resp.content.strip())
                return {
                    "suggested_category": parsed.get("category", category),
                    "suggested_amount": float(parsed.get("amount", amount)),
                    "suggested_type": parsed.get("transaction_type", transaction_type),
                    "suggested_description": parsed.get("description", description),
                    "confidence": float(parsed.get("confidence", 0.95))
                }
            except Exception:
                pass # Fall back to heuristics cleanly

        return {
            "suggested_category": category,
            "suggested_amount": amount,
            "suggested_type": transaction_type,
            "suggested_description": description,
            "confidence": confidence
        }

    def generate_coach_reply(self, message: str, user_metrics: Dict[str, Any]) -> str:
        """
        Generates conversational financial coaching strictly grounded in verified DB metrics.
        """
        metrics_summary = f"""
User Financial Metrics:
- Monthly Income: {user_metrics.get('currency', '₹')}{user_metrics.get('income', 0)}
- Monthly Expenses: {user_metrics.get('currency', '₹')}{user_metrics.get('expenses', 0)}
- Total Savings: {user_metrics.get('currency', '₹')}{user_metrics.get('savings', 0)}
- Health Score: {user_metrics.get('health_score', 75)}/100
- Active Streak: 🔥 {user_metrics.get('streak', 1)} days
- Level: Level {user_metrics.get('level', 1)} ({user_metrics.get('xp', 0)} XP)
- Top Expense Category: {user_metrics.get('top_category', 'Food & Dining')}
"""

        msg_lower = message.lower()

        # Try LLM provider first if API key configured
        if self.provider == "openai" and self.openai_key:
            try:
                from langchain_openai import ChatOpenAI
                llm = ChatOpenAI(openai_api_key=self.openai_key, model="gpt-3.5-turbo", temperature=0.7)
                system = f"You are FinQuest's AI Financial Coach. Guide the user with empathetic, actionable, gamified financial tips. Use verified metrics below, do not invent fake numbers.\n{metrics_summary}"
                resp = llm.invoke(f"{system}\nUser: {message}\nAssistant:")
                return resp.content
            except Exception:
                pass

        # Offline Intelligent Rule-Based Coach Engine
        if any(w in msg_lower for w in ["where", "spend", "most", "highest"]):
            return f"Based on your recent transactions, your highest spending category is **{user_metrics.get('top_category', 'Food & Dining')}**. You've spent {user_metrics.get('currency', '₹')}{user_metrics.get('expenses', 0)} total this month across all categories. Keeping an eye on small daily food orders can help you save more!"

        if any(w in msg_lower for w in ["how much", "save", "savings"]):
            return f"Great question! You currently have **{user_metrics.get('currency', '₹')}{user_metrics.get('savings', 0)}** saved. Your savings score contributes significantly to your Financial Health Score of **{user_metrics.get('health_score', 75)}/100**."

        if any(w in msg_lower for w in ["challenge", "goal", "next month"]):
            return f"To save an extra {user_metrics.get('currency', '₹')}5,000 next month, try joining the **7-Day Budget Challenge** in your Challenges tab! Staying within your daily food target for 7 days will award you **+250 XP** and accelerate your savings goal."

        return f"Hello Adventurer! You're currently Level {user_metrics.get('level', 1)} with a {user_metrics.get('streak', 1)}-day streak 🔥. Your total monthly spending is {user_metrics.get('currency', '₹')}{user_metrics.get('expenses', 0)}. To level up faster and boost your health score ({user_metrics.get('health_score', 75)}/100), make sure to log your daily transactions and stick to your budget caps!"

ai_provider_service = AIProviderService()
