import { useState, useEffect } from 'react';
import { HistoryItem } from '../types';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem('prompt_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem('prompt_history');
    setHistory([]);
  };

  return { history, addHistory, clearHistory };
};
