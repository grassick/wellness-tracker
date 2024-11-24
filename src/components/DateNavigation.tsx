import React from 'react';
import { format, addDays, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface Props {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigation({ selectedDate, onDateChange }: Props) {
  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
      <button
        onClick={() => onDateChange(addDays(selectedDate, -1))}
        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <ChevronLeft className="text-gray-400" />
      </button>
      
      <div className="flex items-center space-x-2">
        <CalendarDays className="text-indigo-400" />
        <span className="text-gray-200 font-medium">
          {format(selectedDate, 'MMMM d, yyyy')}
        </span>
      </div>

      <div className="flex space-x-2">
        {!isToday(selectedDate) && (
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Today
          </button>
        )}
        <button
          onClick={() => onDateChange(addDays(selectedDate, 1))}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          disabled={isToday(selectedDate)}
        >
          <ChevronRight className={isToday(selectedDate) ? 'text-gray-600' : 'text-gray-400'} />
        </button>
      </div>
    </div>
  );
}