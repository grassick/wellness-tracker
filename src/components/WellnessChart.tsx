import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { DailyRecord, WellnessData } from '../types';

interface Props {
  data: WellnessData;
  calculateScore: (record: DailyRecord) => number;
  maxScore: number;
}

export function WellnessChart({ data, calculateScore, maxScore }: Props) {
  const chartData = [...data.records]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(record => ({
      date: record.date,
      score: calculateScore(record)
    }));

  return (
    <div className="h-[300px] w-full bg-gray-800 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), 'MMM d')}
            stroke="#9CA3AF"
          />
          <YAxis
            domain={[0, maxScore]}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            labelFormatter={(date) => format(parseISO(date as string), 'MMMM d, yyyy')}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366F1"
            strokeWidth={2}
            dot={{ fill: '#6366F1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}