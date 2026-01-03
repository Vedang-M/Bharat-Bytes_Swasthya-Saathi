import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Loader2, Activity } from 'lucide-react';
import { api, TrendData } from '../services/api';

interface TrendsViewProps {
  onBack: () => void;
}

export function TrendsView({ onBack }: TrendsViewProps) {
  const [selectedParameter, setSelectedParameter] = useState('hemoglobin');
  const [compareMode, setCompareMode] = useState(false);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTrends();
      setTrendData(data);
      // Set first available parameter as selected
      if (data.available_parameters?.length > 0) {
        setSelectedParameter(data.available_parameters[0]);
      }
    } catch (err) {
      console.error('Failed to load trends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3A9CA6] animate-spin" />
      </div>
    );
  }

  const healthScoreData = trendData?.health_score_trend || [];
  const parameterTrends = trendData?.parameter_trends || {};
  const availableParams = Object.keys(parameterTrends);

  const currentParamData = parameterTrends[selectedParameter];
  const currentData = currentParamData?.data_points || [];

  const parameters = availableParams.map(key => {
    const pData = parameterTrends[key];
    const points = pData?.data_points || [];
    const lastPoint = points[points.length - 1];

    let status = 'normal';
    if (lastPoint) {
      if (lastPoint.value < lastPoint.refLow) status = 'low';
      else if (lastPoint.value > lastPoint.refHigh) status = 'high';
    }

    return {
      id: key,
      name: pData?.parameter_name || key,
      unit: pData?.unit || '',
      trend: pData?.trend_direction || 'stable',
      status
    };
  });

  const currentParam = parameters.find(p => p.id === selectedParameter);

  // Dynamic Trend Calculation
  const getHealthScoreTrend = () => {
    if (!healthScoreData || healthScoreData.length < 2) {
      return { label: 'Stable Trend', color: '#5E6C7A', icon: Activity, bg: 'bg-[#E5E9ED]/50' };
    }

    // Assuming data is sorted by date, but let's be safe
    const sorted = [...healthScoreData].sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const first = sorted[0].score;
    const last = sorted[sorted.length - 1].score;
    const diff = last - first;

    if (diff >= 5) return { label: 'Improving Trend', color: '#2E7D5B', icon: TrendingUp, bg: 'bg-[#2E7D5B]/10' };
    if (diff <= -5) return { label: 'Declining Trend', color: '#C89B3C', icon: TrendingDown, bg: 'bg-[#C89B3C]/10' };
    return { label: 'Stable Trend', color: '#3A9CA6', icon: Activity, bg: 'bg-[#3A9CA6]/10' };
  };

  const trendInfo = getHealthScoreTrend();
  const TrendStatusIcon = trendInfo.icon;

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
                className={`relative w-12 h-6 rounded-full transition-colors ${compareMode ? 'bg-[#3A9CA6]' : 'bg-[#E5E9ED]'
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
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${trendInfo.bg}`}>
              <TrendStatusIcon className="w-4 h-4" style={{ color: trendInfo.color }} />
              <span className="text-sm" style={{ color: trendInfo.color }}>{trendInfo.label}</span>
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
            {parameters.map((param) => {
              const isSelected = selectedParameter === param.id;
              const isLow = param.status === 'low';

              let bgClass = 'bg-[#F7F9FB] text-[#5E6C7A] hover:bg-[#E5E9ED]';
              if (isSelected) {
                bgClass = isLow ? 'bg-red-500 text-white shadow-md' : 'bg-[#3A9CA6] text-white shadow-md';
              } else if (isLow) {
                bgClass = 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100';
              }

              return (
                <button
                  key={param.id}
                  onClick={() => setSelectedParameter(param.id)}
                  className={`px-6 py-3 rounded-xl transition-all whitespace-nowrap ${bgClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{param.name}</span>
                    {param.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : param.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Parameter Chart */}
          {currentData.length > 0 && (
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
          )}

          {/* Insights */}
          <div className="mt-6 p-4 bg-[#6B5B95]/5 rounded-xl border border-[#6B5B95]/20">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#6B5B95] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#1F2933] mb-1">Trend Observation</p>
                <p className="text-sm text-[#5E6C7A] leading-relaxed">
                  {currentParam?.name} has shown a {currentParam?.trend === 'up' ? 'increasing' : currentParam?.trend === 'down' ? 'decreasing' : 'stable'} trend
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
