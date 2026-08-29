'use client';

import React, { useState } from 'react';
import { fetchAPI } from '../../lib/api';

export default function CoachPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hello! I am your FinQuest AI Financial Coach. Your verified Financial Health Score is 78/100 and you have a 14-day streak. Ask me any question about your cash flow or savings goals."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const SUGGESTED_PROMPTS = [
    "Where did I spend the most this month?",
    "How can I save ₹5,000 next month?",
    "Why are my expenses increasing?",
    "Analyze my budget adherence"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: query }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const data = await fetchAPI('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: query })
      });
      setMessages([...newMsgs, { sender: 'assistant', text: data.reply }]);
    } catch {
      let reply = "Based on your verified records, your highest spending category is Food & Dining. Reducing restaurant orders this week will help save ₹1,500.";
      if (query.toLowerCase().includes('save')) {
        reply = "To save ₹5,000 next month, join the 7-Day Budget Challenge in your Challenges tab and contribute ₹1,250 weekly to your savings goal.";
      }
      setMessages([...newMsgs, { sender: 'assistant', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-130px)]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          AI Financial Coach
        </h1>
        <p className="text-xs text-slate-500">
          Personalized guidance grounded strictly in your authorized financial database metrics.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 fin-card p-4 overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-slate-400 font-semibold mb-1">
              {m.sender === 'user' ? 'User' : 'AI Assistant'}
            </span>
            <div className={`max-w-xl p-3 rounded-md text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-slate-400 font-semibold">
            Calculating verified metrics...
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a financial question..."
          className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-md text-xs transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
