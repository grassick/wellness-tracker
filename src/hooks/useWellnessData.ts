import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { WellnessData, DailyRecord, WellnessItem } from '../types';
import { defaultItems } from '../data';
import { auth, database, signInAnonymously } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { useSearchParams } from 'react-router-dom';

export function useWellnessData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<WellnessData>({ items: defaultItems, records: [] });
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [loading, setLoading] = useState(true);

  const [uuid, setUuid] = useState<string>(() => {
    const uuidFromParams = searchParams.get('uuid')
    if (uuidFromParams) {
      return uuidFromParams
    }
    return crypto.randomUUID()
  })

  const unsubscribeRef = useRef<(() => void) | undefined>(undefined)

  const initAuth = async () => {
    try {
      await signInAnonymously(auth)
      setSearchParams({ uuid })

      const dataRef = ref(database, `users/${uuid}/data`)
      unsubscribeRef.current = onValue(dataRef, (snapshot) => {
        const val = snapshot.val()
        console.log('val', val)
        if (val) {
          setData({
            items: val.items || defaultItems,
            records: val.records || []
          })
        } else {
          set(dataRef, { items: defaultItems, records: [] })
        }
        setLoading(false)
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    initAuth().catch(console.error)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  const getDateString = (date: Date) => format(date, 'yyyy-MM-dd');

  const getCurrentRecord = () => {
    const dateStr = getDateString(selectedDate);
    return data.records.find(r => r.date === dateStr) || { date: dateStr, checkedItems: [] };
  };

  const toggleItem = async (itemId: string) => {
    const dateStr = getDateString(selectedDate);
    const currentRecord = getCurrentRecord();
    const newCheckedItems = currentRecord.checkedItems.includes(itemId)
      ? currentRecord.checkedItems.filter(id => id !== itemId)
      : [...currentRecord.checkedItems, itemId];

    const newRecords = data.records.filter(r => r.date !== dateStr);
    if (newCheckedItems.length > 0) {
      newRecords.push({ date: dateStr, checkedItems: newCheckedItems });
    }

    const newData = { ...data, records: newRecords };
    await set(ref(database, `users/${uuid}/data`), newData);
    setData(newData);
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

  const updateItems = async (newItems: WellnessItem[]) => {
    const newData = { ...data, items: newItems };
    await set(ref(database, `users/${uuid}/data`), newData);
    setData(newData);
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
    loading
  };
}