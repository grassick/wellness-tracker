import React from 'react';
import { WellnessItem } from '../types';
import { Check } from 'lucide-react';

interface Props {
  title: string;
  items: WellnessItem[];
  checkedItems: string[];
  onToggle: (id: string) => void;
}

export function CheckboxGroup({ title, items, checkedItems, onToggle }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
              checkedItems.includes(item.id)
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className={`w-5 h-5 flex items-center justify-center border rounded ${
              checkedItems.includes(item.id)
                ? 'border-white bg-indigo-600'
                : 'border-gray-500'
            }`}>
              {checkedItems.includes(item.id) && <Check size={16} />}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}