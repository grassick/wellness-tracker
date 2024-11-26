import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { WellnessData, DailyRecord, WellnessItem } from '../types';
import { defaultItems } from '../data';
import { auth, database, signInAnonymously } from '../firebase';
import { ref, onValue, set } from 'firebase/database';
import { useSearchParams } from 'react-router-dom';
import { produce } from 'immer';

const UUID_STORAGE_KEY = 'wellness-uuid'

export function useWellnessData() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<WellnessData>({ items: defaultItems, records: [], weightTrackingEnabled: false });
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [loading, setLoading] = useState(true);

  const uuid = useMemo(() => {
    const uuidFromParams = searchParams.get('uuid')
    if (uuidFromParams) {
      localStorage.setItem(UUID_STORAGE_KEY, uuidFromParams)
      return uuidFromParams
    }

    const storedUuid = localStorage.getItem(UUID_STORAGE_KEY)
    if (storedUuid) {
      return storedUuid
    }

    const newUuid = crypto.randomUUID()
    localStorage.setItem(UUID_STORAGE_KEY, newUuid)
    return newUuid
  }, [searchParams])

  const unsubscribeRef = useRef<(() => void) | undefined>(undefined)

  const initAuth = async () => {
    try {
      await signInAnonymously(auth)
      setSearchParams({ uuid })

      const dataRef = ref(database, `users/${uuid}/data`)
      unsubscribeRef.current = onValue(dataRef, (snapshot) => {
        const val = snapshot.val()
        if (val) {
          setData(produce(draft => {
            draft.items = val.items || defaultItems
            draft.records = val.records || []
            draft.weightTrackingEnabled = val.weightTrackingEnabled || false
          }))
        } else {
          set(dataRef, { items: defaultItems, records: [], weightTrackingEnabled: false })
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
    return data.records.find(r => r.date === dateStr) || { date: dateStr, checkedItems: [], weight: null };
  };

  const toggleItem = async (itemId: string) => {
    const dateStr = getDateString(selectedDate);

    const newData = produce(data, draft => {
      // Get or create record for this date
      let record = draft.records.find(r => r.date === dateStr)
      if (!record) {
        record = { date: dateStr, checkedItems: [], weight: null };
        draft.records.push(record);
      }

      // Update checked items
      const newCheckedItems = (record.checkedItems || []).includes(itemId)
        ? (record.checkedItems || []).filter((id: string) => id !== itemId)
        : [...(record.checkedItems || []), itemId];

      record.checkedItems = newCheckedItems;
    });

    setData(newData);
    await set(ref(database, `users/${uuid}/data`), newData);
  };

  const updateWeight = async (weight: number | undefined) => {
    const dateStr = getDateString(selectedDate);

    const newData = produce(data, draft => {
      // Get or create record for this date
      let record = draft.records.find(r => r.date === dateStr)
      if (!record) {
        record = { date: dateStr, checkedItems: [], weight: null };
        draft.records.push(record);
      }
      record.weight = weight || null;
    });

    setData(newData);
    await set(ref(database, `users/${uuid}/data`), newData);
  };

  const calculateScore = (record: DailyRecord) => {
    let score = 0;
    data.items.forEach(item => {
      if (item.type === 'positive' && (record.checkedItems || []).includes(item.id)) {
        score++;
      }
      if (item.type === 'negative' && !(record.checkedItems || []).includes(item.id)) {
        score++;
      }
    });
    return score;
  };

  const getMaxScore = () => data.items.length;

  const updateItems = async (newItems: WellnessItem[], weightTrackingEnabled: boolean) => {
    const newData = { ...data, items: newItems, weightTrackingEnabled };
    await set(ref(database, `users/${uuid}/data`), newData);
    setData(newData);
  };

  const getWeightData = () => {
    return [...data.records]
      .filter(record => record.weight !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => ({
        date: record.date,
        weight: record.weight as number
      }));
  };

  const updateWeightTrackingEnabled = async (enabled: boolean) => {
    const newData = { ...data, weightTrackingEnabled: enabled };
    await set(ref(database, `users/${uuid}/data`), newData);
    setData(newData);
  };

  console.log('data', data)

  return {
    data,
    selectedDate,
    setSelectedDate,
    getCurrentRecord,
    toggleItem,
    calculateScore,
    getMaxScore,
    updateItems,
    loading,
    updateWeight,
    getWeightData,
    updateWeightTrackingEnabled
  };
}