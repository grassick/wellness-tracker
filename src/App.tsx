import React, { useState } from 'react';
import { CheckboxGroup } from './components/CheckboxGroup';
import { DateNavigation } from './components/DateNavigation';
import { WellnessChart } from './components/WellnessChart';
import { ConfigModal } from './components/ConfigModal';
import { useWellnessData } from './hooks/useWellnessData';
import { Activity, Settings, Loader2 } from 'lucide-react';

function App() {
  const {
    data,
    selectedDate,
    setSelectedDate,
    getCurrentRecord,
    toggleItem,
    calculateScore,
    getMaxScore,
    updateItems,
    loading
  } = useWellnessData();

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading your wellness data...</span>
        </div>
      </div>
    );
  }

  const currentRecord = getCurrentRecord();
  const positiveItems = data.items.filter(item => item.type === 'positive');
  const negativeItems = data.items.filter(item => item.type === 'negative');
  const currentScore = calculateScore(currentRecord);
  const maxScore = getMaxScore();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold">Wellness Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Configure habits"
            >
              <Settings size={20} />
            </button>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-gray-400">Score: </span>
              <span className="text-xl font-bold text-indigo-400">
                {currentScore}/{maxScore}
              </span>
            </div>
          </div>
        </div>

        {/* Date Navigation */}
        <DateNavigation
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Checkboxes */}
        <div className="grid gap-6">
          <CheckboxGroup
            title="Positive Habits"
            items={positiveItems}
            checkedItems={currentRecord.checkedItems}
            onToggle={toggleItem}
          />
          <CheckboxGroup
            title="Habits to Avoid"
            items={negativeItems}
            checkedItems={currentRecord.checkedItems}
            onToggle={toggleItem}
          />
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Wellness History</h2>
          <WellnessChart
            data={data}
            calculateScore={calculateScore}
            maxScore={maxScore}
          />
        </div>
      </div>

      <ConfigModal
        items={data.items}
        onSave={updateItems}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </div>
  );
}

export default App;