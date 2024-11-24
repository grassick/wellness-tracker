import React, { useState } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';
import { WellnessItem } from '../types';

interface Props {
  items: WellnessItem[];
  onSave: (items: WellnessItem[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigModal({ items, onSave, isOpen, onClose }: Props) {
  const [editableItems, setEditableItems] = useState<WellnessItem[]>(() => [...items]);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemType, setNewItemType] = useState<'positive' | 'negative'>('positive');

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (!newItemLabel.trim()) return;
    const newItem: WellnessItem = {
      id: newItemLabel.toLowerCase().replace(/\s+/g, '_'),
      label: newItemLabel.trim(),
      type: newItemType
    };
    setEditableItems([...editableItems, newItem]);
    setNewItemLabel('');
  };

  const handleRemoveItem = (id: string) => {
    setEditableItems(editableItems.filter(item => item.id !== id));
  };

  const handleSave = () => {
    onSave(editableItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Settings size={20} className="text-indigo-400" />
            Configure Habits
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add new item form */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            placeholder="New habit name"
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <select
            value={newItemType}
            onChange={(e) => setNewItemType(e.target.value as 'positive' | 'negative')}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
          <button
            onClick={handleAddItem}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Items list */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Positive Habits</h3>
          <div className="space-y-2">
            {editableItems.filter(item => item.type === 'positive').map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span className="text-white">{item.label}</span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-medium text-white mt-6">Habits to Avoid</h3>
          <div className="space-y-2">
            {editableItems.filter(item => item.type === 'negative').map(item => (
              <div key={item.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span className="text-white">{item.label}</span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}