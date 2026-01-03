import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';

interface ParameterDetailsProps {
  onBack: () => void;
}

interface Parameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low';
  category: string;
  explanation?: string;
}

export function ParameterDetails({ onBack }: ParameterDetailsProps) {
  const [expandedParam, setExpandedParam] = useState<string | null>(null);

  const parameters: Parameter[] = [
    {
      name: "Hemoglobin",
      value: "11.2",
      unit: "g/dL",
      referenceRange: "13.0 - 17.0",
      status: "low",
      category: "Blood Count",
      explanation: "Hemoglobin carries oxygen throughout the body. Lower values may indicate iron deficiency or other conditions."
    },
    {
      name: "White Blood Cell Count",
      value: "7.5",
      unit: "×10³/μL",
      referenceRange: "4.0 - 11.0",
      status: "normal",
      category: "Blood Count"
    },
    {
      name: "Total Cholesterol",
      value: "245",
      unit: "mg/dL",
      referenceRange: "< 200",
      status: "high",
      category: "Lipid Profile",
      explanation: "Total cholesterol includes HDL, LDL, and other lipid components. Values above 200 mg/dL are considered elevated."
    },
    {
      name: "HDL Cholesterol",
      value: "48",
      unit: "mg/dL",
      referenceRange: "> 40",
      status: "normal",
      category: "Lipid Profile"
    },
    {
      name: "LDL Cholesterol",
      value: "165",
      unit: "mg/dL",
      referenceRange: "< 100",
      status: "high",
      category: "Lipid Profile",
      explanation: "LDL is often called 'bad cholesterol'. Elevated levels may contribute to cardiovascular risk factors."
    },
    {
      name: "Triglycerides",
      value: "142",
      unit: "mg/dL",
      referenceRange: "< 150",
      status: "normal",
      category: "Lipid Profile"
    },
    {
      name: "Fasting Glucose",
      value: "94",
      unit: "mg/dL",
      referenceRange: "70 - 100",
      status: "normal",
      category: "Metabolic"
    },
    {
      name: "HbA1c",
      value: "5.6",
      unit: "%",
      referenceRange: "< 5.7",
      status: "normal",
      category: "Metabolic"
    },
    {
      name: "Vitamin D",
      value: "18",
      unit: "ng/mL",
      referenceRange: "30 - 100",
      status: "low",
      category: "Vitamins",
      explanation: "Vitamin D supports bone health and immune function. Values below 30 ng/mL are considered insufficient."
    },
    {
      name: "Vitamin B12",
      value: "425",
      unit: "pg/mL",
      referenceRange: "200 - 900",
      status: "normal",
      category: "Vitamins"
    },
  ];

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
                        onClick={() => setExpandedParam(expandedParam === param.name ? null : param.name)}
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
                              {param.explanation && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[#6B5B95]">View Explanation</span>
                                  {expandedParam === param.name ? (
                                    <ChevronUp className="w-4 h-4 text-[#6B5B95]" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#6B5B95]" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Expanded Explanation */}
                      {expandedParam === param.name && param.explanation && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="p-4 bg-[#6B5B95]/5 rounded-xl border border-[#6B5B95]/20">
                            <p className="text-xs text-[#6B5B95] mb-2">Educational Explanation</p>
                            <p className="text-sm text-[#5E6C7A] leading-relaxed">{param.explanation}</p>
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
