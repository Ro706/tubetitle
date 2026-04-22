import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

import { GeneratedTitle } from '../lib/gemini';

export interface HistoryItem {
  id: string;
  query: string;
  titles: GeneratedTitle[];
  date: string;
}

const STORAGE_KEY = 'tubetitle_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  const addToHistory = useCallback(async (query: string, titles: GeneratedTitle[]) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      query,
      titles,
      date: new Date().toLocaleDateString(),
    };
    
    setHistory(prev => {
      const newHistory = [newItem, ...prev];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory)).catch(e => 
        console.error('Failed to save history', e)
      );
      return newHistory;
    });
  }, []);

  return { history, addToHistory };
}
