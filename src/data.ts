import { WellnessItem } from './types';

export const defaultItems: WellnessItem[] = [
  { id: 'sunshine', label: 'Sunshine', type: 'positive' },
  { id: 'morning_walk', label: 'Morning Walk', type: 'positive'},
  { id: 'cardio', label: "Cardio", type: 'positive' },
  { id: 'sleep_hygiene', label: 'Sleep Hygiene', type: 'positive' },
  { id: 'floss', label: 'Floss', type: 'positive' }, 
  { id: 'diary', label: "Journal", type: 'positive' },
  { id: 'vitamins', label: "Vitamins", type: "positive" },
  { id: 'physio', label: 'Physio/Stretch', type: 'positive' },
  { id: 'social_media', label: 'Social Media', type: 'negative' },
  { id: 'news', label: 'News', type: 'negative' },
  { id: 'videos', label: 'Videos', type: 'negative' },
  { id: 'junk_food', label: 'Junk Food', type: 'negative' }  
];