export interface WellnessItem {
  id: string;
  label: string;
  type: 'positive' | 'negative';
}

export interface DailyRecord {
  date: string;
  checkedItems: string[];
}

export interface WellnessData {
  items: WellnessItem[];
  records: DailyRecord[];
}