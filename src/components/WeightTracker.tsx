import { useState, useEffect, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface WeightTrackerProps {
  currentWeight: number | null
  onWeightUpdate: (weight: number | undefined) => Promise<void>
  weightData: Array<{ date: string; weight: number }>
}

function WeightTracker(props: WeightTrackerProps) {
  const { currentWeight, onWeightUpdate, weightData } = props
  const [weight, setWeight] = useState<string>(currentWeight?.toString() || '')

  useEffect(() => {
    setWeight(currentWeight?.toString() || '')
  }, [currentWeight])

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setWeight(newValue)

    const numericWeight = newValue === '' ? undefined : parseFloat(newValue)
    if (numericWeight === undefined || (!isNaN(numericWeight) && numericWeight > 0)) {
      onWeightUpdate(numericWeight)
    }
  }

  const chartData = useMemo(() =>
    [...weightData]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(data => ({
        date: data.date,
        weight: data.weight
      }))
    , [weightData])

  const { minWeight, maxWeight, padding } = useMemo(() => {
    const min = Math.min(...chartData.map(d => d.weight))
    const max = Math.max(...chartData.map(d => d.weight))
    const pad = 2
    return { minWeight: min, maxWeight: max, padding: pad }
  }, [chartData])

  const domain = useMemo(() => [Math.floor(minWeight - padding), Math.ceil(maxWeight + padding)], [minWeight, maxWeight, padding])

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-200 mb-4">Weight Tracking</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-4">
          <input
            type="number"
            value={weight}
            onChange={handleWeightChange}
            placeholder="Enter weight (lbs)"
            step="0.1"
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {weightData.length > 0 && (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                  stroke="#9CA3AF"
                />
                <YAxis
                  domain={domain}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelFormatter={(date) => format(parseISO(date as string), 'MMMM d, yyyy')}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={{ fill: '#6366F1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeightTracker 