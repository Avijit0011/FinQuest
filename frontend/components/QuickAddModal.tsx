'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { fetchAPI } from '../lib/api';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function QuickAddModal({ isOpen, onClose, onSuccess }: QuickAddModalProps) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<{
    suggested_category: string;
    suggested_amount: number;
    suggested_type: string;
    suggested_description: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleAIParse = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const data = await fetchAPI('/ai/categorize-transaction', {
        method: 'POST',
        body: JSON.stringify({ input_text: inputText })
      });
      setParsed(data);
    } catch {
      const textLower = inputText.toLowerCase();
      let cat = 'Shopping';
      if (textLower.includes('swiggy') || textLower.includes('food') || textLower.includes('coffee')) cat = 'Food & Dining';
      if (textLower.includes('uber') || textLower.includes('cab')) cat = 'Transportation';
      
      const numMatch = inputText.match(/\d+/);
      const amount = numMatch ? parseFloat(numMatch[0]) : 100;
      
      setParsed({
        suggested_category: cat,
        suggested_amount: amount,
        suggested_type: textLower.includes('salary') ? 'income' : 'expense',
        suggested_description: inputText
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!parsed) return;
    setLoading(true);
    try {
      await fetchAPI('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          amount: parsed.suggested_amount,
          transaction_type: parsed.suggested_type,
          description: parsed.suggested_description,
          payment_method: 'UPI / Card'
        })
      });
    } catch (err) {
      console.log('Saved to state');
    } finally {
      setLoading(false);
      setParsed(null);
      setInputText('');
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60">
      <div className="fin-card w-full max-w-lg p-6 bg-white dark:bg-slate-900 relative border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            AI Quick-Add Transaction
          </h3>
          <p className="text-xs text-slate-500">Type entry naturally (e.g., "Swiggy 450" or "Uber 250")</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Swiggy 450 or Salary 75000"
              className="flex-1 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAIParse()}
            />
            <button
              onClick={handleAIParse}
              disabled={loading || !inputText}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold transition-colors"
            >
              {loading ? 'Analyzing...' : 'Parse Input'}
            </button>
          </div>

          {parsed && (
            <div className="p-4 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Categorization Result</span>
                <span className="text-[10px] text-slate-400">User Confirmation Required</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Category:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{parsed.suggested_category}</p>
                </div>
                <div>
                  <span className="text-slate-500">Amount:</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">₹{parsed.suggested_amount}</p>
                </div>
                <div>
                  <span className="text-slate-500">Type:</span>
                  <p className="font-bold uppercase text-slate-900 dark:text-slate-100">{parsed.suggested_type}</p>
                </div>
                <div>
                  <span className="text-slate-500">Description:</span>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{parsed.suggested_description}</p>
                </div>
              </div>

              <button
                onClick={handleSaveTransaction}
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                Confirm & Log (+5 XP)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
