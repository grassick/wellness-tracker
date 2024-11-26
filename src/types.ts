export interface WellnessItem {
  id: string;
  label: string;
  type: 'positive' | 'negative';
}

export interface DailyRecord {
  date: string;
  checkedItems?: string[]
  weight: number | null;
}

export interface WellnessData {
  items: WellnessItem[];
  records: DailyRecord[];
  weightTrackingEnabled?: boolean;
}