import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, TrendingUp, TrendingDown, Activity, Calendar, Info, BookOpen, Loader2 } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { api, ReportData, Parameter } from '../services/api';

interface ReportOverviewProps {
  onNavigate: (view: string) => void;
}

export function ReportOverview({ onNavigate }: ReportOverviewProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLatestReport();
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report');
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

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#C89B3C] mx-auto mb-4" />
          <p className="text-[#5E6C7A]">{error || 'No report data available'}</p>
          <button
            onClick={loadReport}
            className="mt-4 px-4 py-2 bg-[#3A9CA6] text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { health_clarity_score, abnormal_parameters, normal_parameters, report_date } = reportData;
  const healthClarityScore = health_clarity_score.score;
  const severityLevel = health_clarity_score.severity_level;
  const severityColor = health_clarity_score.severity_color;
  const normalCount = normal_parameters.length;
  const abnormalCount = abnormal_parameters.length;

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl text-[#1F2933]">Health Report Overview</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#5E6C7A]">
                <Calendar className="w-4 h-4" />
                <span>{report_date}</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-[#E5E9ED] text-[#2F4A68] rounded-lg hover:bg-[#F7F9FB] transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>
          <p className="text-[#5E6C7A]">Comprehensive analysis of your medical test results</p>
        </div>

        {/* Health Clarity Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] p-8 mb-6"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-[#6B5B95]" />
                <h2 className="text-xl text-[#1F2933]">Health Clarity Score</h2>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button className="ml-1">
                        <Info className="w-4 h-4 text-[#5E6C7A]" />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-[#2F4A68] text-white px-3 py-2 rounded-lg text-sm max-w-xs"
                        sideOffset={5}
                      >
                        A composite metric based on parameter deviations from reference ranges
                        <Tooltip.Arrow className="fill-[#2F4A68]" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>

              {/* Circular Progress */}
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#E5E9ED"
                    strokeWidth="12"
                    fill="none"
                  />
                  <motion.circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={severityColor}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - healthClarityScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl text-[#1F2933]">{healthClarityScore}</span>
                  <span className="text-sm text-[#5E6C7A]">out of 100</span>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${severityColor}20` }}>
                  <AlertCircle className="w-4 h-4" style={{ color: severityColor }} />
                  <span className="text-sm" style={{ color: severityColor }}>{severityLevel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg text-[#1F2933] mb-4">Key Findings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#2E7D5B]/5 rounded-xl">
                    <span className="text-sm text-[#5E6C7A]">Parameters in Range</span>
                    <span className="text-lg text-[#2E7D5B]">{normalCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#C89B3C]/5 rounded-xl">
                    <span className="text-sm text-[#5E6C7A]">Parameters Needing Attention</span>
                    <span className="text-lg text-[#C89B3C]">{abnormalCount}</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('trends')}
                  className="w-full px-6 py-3 bg-[#3A9CA6] text-white rounded-xl hover:bg-[#2F4A68] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Trends Over Time
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple Explanation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-[#3A9CA6]/5 to-white rounded-2xl shadow-md border border-[#3A9CA6]/20 p-8 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-6 h-6 text-[#3A9CA6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xl text-[#2F4A68]">What does this mean?</h3>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#3A9CA6] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-[#1F2933] leading-relaxed">
                    This report summarizes your test results in a simple way.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#3A9CA6] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-[#1F2933] leading-relaxed">
                    The <span className="text-[#6B5B95]">Health Clarity Score</span> shows how many of your test values are within expected ranges. Higher scores mean more values are in the normal range.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#3A9CA6] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-[#1F2933] leading-relaxed">
                    <span className="text-[#2E7D5B]">Parameters in Range</span> means those test values fall within the typical reference ranges used by laboratories.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-[#3A9CA6] rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-[#1F2933] leading-relaxed">
                    <span className="text-[#C89B3C]">Parameters Needing Attention</span> are values outside typical ranges. This does not mean a diagnosis—many factors can affect test results.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  onClick={() => onNavigate('explanations')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3A9CA6]/30 text-[#3A9CA6] rounded-lg hover:bg-[#3A9CA6]/5 hover:border-[#3A9CA6] transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Learn More About Parameters
                </button>
                <button
                  onClick={() => onNavigate('trends')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3A9CA6]/30 text-[#3A9CA6] rounded-lg hover:bg-[#3A9CA6]/5 hover:border-[#3A9CA6] transition-all text-sm"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Trends
                </button>
              </div>

              <div className="pt-4 border-t border-[#3A9CA6]/10">
                <p className="text-xs text-[#5E6C7A] leading-relaxed">
                  This explanation is for informational purposes only and is not a medical diagnosis.
                  Consult healthcare professionals for personalized medical guidance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Abnormal Parameters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] p-8"
        >
          <h3 className="text-xl text-[#1F2933] mb-6">Parameters Requiring Attention</h3>
          <div className="space-y-4">
            {abnormal_parameters.slice(0, 5).map((param, index) => {
              const isHigh = param.status === 'high';
              const isLow = param.status === 'low';
              return (
                <motion.div
                  key={param.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => onNavigate('parameters')}
                  className={`p-4 border rounded-xl transition-all cursor-pointer ${isLow
                      ? 'border-red-200 bg-red-50/50 hover:border-red-300'
                      : 'border-[#E5E9ED] hover:border-[#3A9CA6] hover:shadow-md'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isHigh ? 'bg-[#C89B3C]/10' : isLow ? 'bg-red-100' : 'bg-[#7A8088]/10'
                        }`}>
                        {param.trend === 'up' && <TrendingUp className={`w-5 h-5 ${isLow ? 'text-red-500' : 'text-[#C89B3C]'}`} />}
                        {param.trend === 'down' && <TrendingDown className={`w-5 h-5 ${isLow ? 'text-red-500' : 'text-[#7A8088]'}`} />}
                        {(!param.trend || param.trend === 'stable') && <Activity className={`w-5 h-5 ${isLow ? 'text-red-500' : 'text-[#5E6C7A]'}`} />}
                      </div>
                      <div>
                        <p className={`font-medium ${isLow ? 'text-red-700' : 'text-[#1F2933]'}`}>{param.name}</p>
                        <p className={`text-sm ${isLow ? 'text-red-600' : 'text-[#5E6C7A]'}`}>
                          {isHigh ? 'Above' : 'Below'} reference range
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg ${isLow ? 'text-red-700 font-semibold' : 'text-[#1F2933]'}`}>
                        {param.value} <span className={`text-sm ${isLow ? 'text-red-600' : 'text-[#5E6C7A]'}`}>{param.unit}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-[#6B5B95]/5 rounded-xl border border-[#6B5B95]/20"
        >
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-[#6B5B95] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#5E6C7A] leading-relaxed">
              This analysis is for informational purposes only and does not constitute medical diagnosis
              or advice. Always consult qualified healthcare professionals for medical decisions and
              treatment plans.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}