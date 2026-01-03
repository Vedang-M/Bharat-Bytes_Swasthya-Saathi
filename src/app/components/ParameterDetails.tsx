import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { api, Parameter } from '../services/api';

interface ParameterDetailsProps {
  onBack: () => void;
}

export function ParameterDetails({ onBack }: ParameterDetailsProps) {
  const [expandedParam, setExpandedParam] = useState<string | null>(null);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParameters();
  }, []);

  const loadParameters = async () => {
    try {
      setIsLoading(true);
      const report = await api.getLatestReport();
      setParameters(report.parameters);
    } catch (err) {
      console.error('Failed to load parameters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExplanation = async (paramName: string, status: string) => {
    try {
      const explanation = await api.getExplanation(paramName, status);
      // Update the parameter with explanation
      setParameters(prev => prev.map(p =>
        p.name === paramName
          ? { ...p, explanation: explanation.explanation }
          : p
      ));
    } catch (err) {
      console.error('Failed to load explanation:', err);
    }
  };

  const handleExpand = (paramName: string, status: string) => {
    if (expandedParam === paramName) {
      setExpandedParam(null);
    } else {
      setExpandedParam(paramName);
      // Load explanation if not already present
      const param = parameters.find(p => p.name === paramName);
      if (param && !param.explanation) {
        loadExplanation(paramName, status);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3A9CA6] animate-spin" />
      </div>
    );
  }

  const categories = Array.from(new Set(parameters.map(p => p.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return '#C89B3C';
      case 'low': return '#7A8088';
      default: return '#2E7D5B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'high': return 'Above Range';
      case 'low': return 'Below Range';
      default: return 'In Range';
    }
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
          <h1 className="text-3xl text-[#1F2933] mb-2">Parameter Details</h1>
          <p className="text-[#5E6C7A]">Comprehensive breakdown of all test parameters</p>
        </div>

        {/* Parameters by Category */}
        <div className="space-y-6">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] overflow-hidden"
            >
              <div className="p-6 bg-[#F7F9FB] border-b border-[#E5E9ED]">
                <h3 className="text-lg text-[#2F4A68]">{category}</h3>
              </div>

              <div className="divide-y divide-[#E5E9ED]">
                {parameters
                  .filter(p => p.category === category)
                  .map((param, index) => (
                    <div key={param.name}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                        className="p-6 hover:bg-[#F7F9FB] transition-colors cursor-pointer"
                        onClick={() => handleExpand(param.name, param.status)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[#1F2933] mb-1">{param.name}</p>
                              <div
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                                style={{
                                  backgroundColor: `${getStatusColor(param.status)}15`,
                                  color: getStatusColor(param.status)
                                }}
                              >
                                {getStatusIcon(param.status)}
                                <span>{getStatusLabel(param.status)}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-[#5E6C7A] mb-1">Value</p>
                              <p className="text-[#1F2933]">{param.value} <span className="text-sm text-[#5E6C7A]">{param.unit}</span></p>
                            </div>

                            <div>
                              <p className="text-xs text-[#5E6C7A] mb-1">Reference Range</p>
                              <p className="text-[#1F2933]">{param.referenceRange} <span className="text-sm text-[#5E6C7A]">{param.unit}</span></p>
                            </div>

                            <div className="flex items-center justify-end">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#6B5B95]">View Explanation</span>
                                {expandedParam === param.name ? (
                                  <ChevronUp className="w-4 h-4 text-[#6B5B95]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-[#6B5B95]" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expanded Explanation */}
                      {expandedParam === param.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="p-4 bg-[#6B5B95]/5 rounded-xl border border-[#6B5B95]/20">
                            <p className="text-xs text-[#6B5B95] mb-2">Educational Explanation</p>
                            <p className="text-sm text-[#5E6C7A] leading-relaxed">
                              {param.explanation || 'Loading explanation...'}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
