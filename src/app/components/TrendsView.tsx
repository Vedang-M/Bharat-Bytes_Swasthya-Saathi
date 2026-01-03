import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface TrendsViewProps {
  onBack: () => void;
}

export function TrendsView({ onBack }: TrendsViewProps) {
  const [selectedParameter, setSelectedParameter] = useState('hemoglobin');
  const [compareMode, setCompareMode] = useState(false);

  // Mock historical data
  const healthScoreData = [
    { date: 'Jun 2025', score: 78 },
    { date: 'Aug 2025', score: 75 },
    { date: 'Oct 2025', score: 72 },
    { date: 'Dec 2025', score: 70 },
    { date: 'Jan 2026', score: 68 },
  ];

  const parameterData: Record<string, any[]> = {
    hemoglobin: [
      { date: 'Jun 2025', value: 13.2, refLow: 13.0, refHigh: 17.0 },
      { date: 'Aug 2025', value: 12.8, refLow: 13.0, refHigh: 17.0 },
      { date: 'Oct 2025', value: 12.1, refLow: 13.0, refHigh: 17.0 },
      { date: 'Dec 2025', value: 11.6, refLow: 13.0, refHigh: 17.0 },
      { date: 'Jan 2026', value: 11.2, refLow: 13.0, refHigh: 17.0 },
    ],
    cholesterol: [
      { date: 'Jun 2025', value: 210, refLow: 0, refHigh: 200 },
      { date: 'Aug 2025', value: 218, refLow: 0, refHigh: 200 },
      { date: 'Oct 2025', value: 232, refLow: 0, refHigh: 200 },
      { date: 'Dec 2025', value: 238, refLow: 0, refHigh: 200 },
      { date: 'Jan 2026', value: 245, refLow: 0, refHigh: 200 },
    ],
    vitaminD: [
      { date: 'Jun 2025', value: 28, refLow: 30, refHigh: 100 },
      { date: 'Aug 2025', value: 25, refLow: 30, refHigh: 100 },
      { date: 'Oct 2025', value: 22, refLow: 30, refHigh: 100 },
      { date: 'Dec 2025', value: 20, refLow: 30, refHigh: 100 },
      { date: 'Jan 2026', value: 18, refLow: 30, refHigh: 100 },
    ],
  };

  const parameters = [
    { id: 'hemoglobin', name: 'Hemoglobin', unit: 'g/dL', trend: 'down' },
    { id: 'cholesterol', name: 'Total Cholesterol', unit: 'mg/dL', trend: 'up' },
    { id: 'vitaminD', name: 'Vitamin D', unit: 'ng/mL', trend: 'down' },
  ];

  const currentData = parameterData[selectedParameter];
  const currentParam = parameters.find(p => p.id === selectedParameter);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-[#E5E9ED]">
          <p className="text-sm text-[#5E6C7A] mb-1">{payload[0].payload.date}</p>
          <p className="text-[#1F2933]">
            Value: <span className="text-[#3A9CA6]">{payload[0].value}</span> {currentParam?.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-[#3A9CA6] hover:text-[#2F4A68] transition-colors mb-4"
          >
            ← Back to Overview
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-[#1F2933] mb-2">Longitudinal Trends</h1>
              <p className="text-[#5E6C7A]">Track health parameters over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5E6C7A]">Compare Reports</span>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  compareMode ? 'bg-[#3A9CA6]' : 'bg-[#E5E9ED]'
                }`}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  animate={{ left: compareMode ? '28px' : '4px' }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Health Clarity Score Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl text-[#1F2933] mb-1">Health Clarity Score Timeline</h3>
              <p className="text-sm text-[#5E6C7A]">6-month trend overview</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#C89B3C]/10 rounded-full">
              <TrendingDown className="w-4 h-4 text-[#C89B3C]" />
              <span className="text-sm text-[#C89B3C]">Declining Trend</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9ED" />
              <XAxis 
                dataKey="date" 
                stroke="#5E6C7A"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#5E6C7A"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip content={CustomTooltip} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6B5B95" 
                strokeWidth={3}
                dot={{ fill: '#6B5B95', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Parameter Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] p-8 mb-6"
        >
          <h3 className="text-xl text-[#1F2933] mb-6">Parameter Trends</h3>
          
          {/* Parameter Tabs */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {parameters.map((param) => (
              <button
                key={param.id}
                onClick={() => setSelectedParameter(param.id)}
                className={`px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                  selectedParameter === param.id
                    ? 'bg-[#3A9CA6] text-white shadow-md'
                    : 'bg-[#F7F9FB] text-[#5E6C7A] hover:bg-[#E5E9ED]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{param.name}</span>
                  {param.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Parameter Chart */}
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9ED" />
              <XAxis 
                dataKey="date" 
                stroke="#5E6C7A"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#5E6C7A"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={CustomTooltip} />
              <Legend />
              
              {/* Reference Range Lines */}
              <Line 
                type="monotone" 
                dataKey="refHigh" 
                stroke="#2E7D5B" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Upper Reference"
              />
              <Line 
                type="monotone" 
                dataKey="refLow" 
                stroke="#2E7D5B" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Lower Reference"
              />
              
              {/* Actual Values */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3A9CA6" 
                strokeWidth={3}
                dot={{ fill: '#3A9CA6', r: 6 }}
                activeDot={{ r: 8 }}
                name={currentParam?.name}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Insights */}
          <div className="mt-6 p-4 bg-[#6B5B95]/5 rounded-xl border border-[#6B5B95]/20">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#6B5B95] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#1F2933] mb-1">Trend Observation</p>
                <p className="text-sm text-[#5E6C7A] leading-relaxed">
                  {currentParam?.name} has shown a {currentParam?.trend === 'up' ? 'increasing' : 'decreasing'} trend 
                  over the past 6 months. Regular monitoring and consultation with healthcare professionals 
                  is recommended for optimal health management.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
