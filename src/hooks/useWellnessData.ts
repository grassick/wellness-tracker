import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { WellnessData, DailyRecord, WellnessItem } from '../types';
import { defaultItems } from '../data';

const STORAGE_KEY = 'wellnessData';

export function useWellnessData() {
  const [data, setData] = useState<WellnessData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: defaultItems, records: [] };
  });

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const getDateString = (date: Date) => format(date, 'yyyy-MM-dd');

  const getCurrentRecord = () => {
    const dateStr = getDateString(selectedDate);
    return data.records.find(r => r.date === dateStr) || { date: dateStr, checkedItems: [] };
  };

  const toggleItem = (itemId: string) => {
    const dateStr = getDateString(selectedDate);
    const currentRecord = getCurrentRecord();
    const newCheckedItems = currentRecord.checkedItems.includes(itemId)
      ? currentRecord.checkedItems.filter(id => id !== itemId)
      : [...currentRecord.checkedItems, itemId];

    const newRecords = data.records.filter(r => r.date !== dateStr);
    if (newCheckedItems.length > 0) {
      newRecords.push({ date: dateStr, checkedItems: newCheckedItems });
    }

    setData(prev => ({ ...prev, records: newRecords }));
  };

  const calculateScore = (record: DailyRecord) => {
    let score = 0;
    data.items.forEach(item => {
      if (item.type === 'positive' && record.checkedItems.includes(item.id)) {
        score++;
      }
      if (item.type === 'negative' && !record.checkedItems.includes(item.id)) {
        score++;
      }
    });
    return score;
  };

  const getMaxScore = () => data.items.length;

  const updateItems = (newItems: WellnessItem[]) => {
    setData(prev => ({ ...prev, items: newItems }));
  };

  return {
    data,
    selectedDate,
    setSelectedDate,
    getCurrentRecord,
    toggleItem,
    calculateScore,
    getMaxScore,
    updateItems,
  };
}