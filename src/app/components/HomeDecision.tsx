import { motion } from 'motion/react';
import { Upload, TrendingUp, Activity } from 'lucide-react';

interface HomeDecisionProps {
  onUploadNew: () => void;
  onViewHistory: () => void;
}

export function HomeDecision({ onUploadNew, onViewHistory }: HomeDecisionProps) {
  const hasPreviousData = true; // This would be dynamic in real implementation

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-6 py-12 relative">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3A9CA6]/5 via-transparent to-[#6B5B95]/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3A9CA6] to-[#6B5B95] rounded-xl flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl text-[#1F2933]">Swasthya Saathi</h1>
              <p className="text-sm text-[#5E6C7A]">Health Intelligence Platform</p>
            </div>
          </div>
          <p className="text-lg text-[#5E6C7A] max-w-2xl mx-auto">
            Choose an option to get started
          </p>
        </motion.div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Upload New Report */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={onUploadNew}
              className="w-full bg-white rounded-2xl shadow-lg border-2 border-[#E5E9ED] hover:border-[#3A9CA6] p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-left group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#3A9CA6]/10 to-[#3A9CA6]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:from-[#3A9CA6]/20 group-hover:to-[#3A9CA6]/10 transition-all">
                  <Upload className="w-10 h-10 text-[#3A9CA6]" />
                </div>

                {/* Content */}
                <h2 className="text-2xl text-[#1F2933] mb-3">Upload New Report</h2>
                <p className="text-[#5E6C7A] leading-relaxed mb-6">
                  Analyze a new medical report and generate health insights.
                </p>

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#3A9CA6] text-white rounded-xl group-hover:bg-[#2F4A68] transition-all duration-300 shadow-md">
                  <Upload className="w-5 h-5" />
                  <span>Upload Report</span>
                </div>
              </div>
            </button>
          </motion.div>

          {/* View Previous Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={onViewHistory}
              disabled={!hasPreviousData}
              className={`w-full bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 text-left group ${
                hasPreviousData
                  ? 'border-[#E5E9ED] hover:border-[#6B5B95] hover:shadow-xl hover:scale-[1.02]'
                  : 'border-[#E5E9ED] opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center mb-6 transition-all ${
                  hasPreviousData
                    ? 'from-[#6B5B95]/10 to-[#6B5B95]/5 group-hover:from-[#6B5B95]/20 group-hover:to-[#6B5B95]/10'
                    : 'from-[#5E6C7A]/10 to-[#5E6C7A]/5'
                }`}>
                  <TrendingUp className={`w-10 h-10 ${hasPreviousData ? 'text-[#6B5B95]' : 'text-[#5E6C7A]'}`} />
                </div>

                {/* Content */}
                <h2 className="text-2xl text-[#1F2933] mb-3">View Previous Analysis</h2>
                <p className="text-[#5E6C7A] leading-relaxed mb-6">
                  {hasPreviousData
                    ? 'Review past reports, graphs, and health trends over time.'
                    : 'No previous reports available yet.'}
                </p>

                {/* CTA Button */}
                {hasPreviousData && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B5B95] text-white rounded-xl group-hover:bg-[#2F4A68] transition-all duration-300 shadow-md">
                    <TrendingUp className="w-5 h-5" />
                    <span>View History</span>
                  </div>
                )}
              </div>
            </button>
          </motion.div>
        </div>

        {/* Microcopy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-[#5E6C7A]">
            You can upload reports anytime or revisit previous insights.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-4 bg-white/50 rounded-xl border border-[#E5E9ED]"
        >
          <p className="text-xs text-center text-[#5E6C7A] leading-relaxed">
            This platform provides educational insights for informational purposes only and does not constitute 
            medical diagnosis or advice. Always consult qualified healthcare professionals for medical decisions.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
