import { useState, useEffect } from 'react';
import { Upload, History, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

interface HomeDecisionProps {
  onUploadNew: () => void;
  onViewHistory: () => void;
}

export function HomeDecision({ onUploadNew, onViewHistory }: HomeDecisionProps) {
  const [hasPreviousData, setHasPreviousData] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    checkPreviousReports();
  }, []);

  const checkPreviousReports = async () => {
    try {
      setIsChecking(true);
      const history = await api.getReportHistory();
      setHasPreviousData(history.total_reports > 0);
      setPreviousCount(history.total_reports);
    } catch (err) {
      // If error, assume no previous data
      setHasPreviousData(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3A9CA6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center"
      >
        {/* Logo/Branding */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#3A9CA6] to-[#6B5B95] rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white">🩺</span>
          </div>
          <h1 className="text-3xl text-[#1F2933] mb-2">Swasthya Saathi</h1>
          <p className="text-[#5E6C7A]">Your Health Clarity Companion</p>
        </motion.div>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* New Upload Option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUploadNew}
            className="p-8 bg-white rounded-2xl shadow-lg border border-[#E5E9ED] hover:border-[#3A9CA6] hover:shadow-xl transition-all text-left group"
          >
            <div className="w-14 h-14 mb-4 bg-[#3A9CA6]/10 rounded-xl flex items-center justify-center group-hover:bg-[#3A9CA6] transition-colors">
              <Upload className="w-7 h-7 text-[#3A9CA6] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl text-[#1F2933] mb-2">Upload New Report</h3>
            <p className="text-sm text-[#5E6C7A] leading-relaxed">
              Analyze a new medical report and get comprehensive health insights
            </p>
            <div className="flex items-center gap-2 mt-4 text-[#3A9CA6]">
              <span className="text-sm">Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.button>

          {/* Previous Analysis Option */}
          <motion.button
            whileHover={{ scale: hasPreviousData ? 1.02 : 1 }}
            whileTap={{ scale: hasPreviousData ? 0.98 : 1 }}
            onClick={hasPreviousData ? onViewHistory : undefined}
            disabled={!hasPreviousData}
            className={`p-8 rounded-2xl shadow-lg border text-left group relative overflow-hidden ${hasPreviousData
              ? 'bg-white border-[#E5E9ED] hover:border-[#6B5B95] hover:shadow-xl cursor-pointer'
              : 'bg-[#F7F9FB] border-[#E5E9ED] cursor-not-allowed opacity-70'
              } transition-all`}
          >
            <div className={`w-14 h-14 mb-4 rounded-xl flex items-center justify-center transition-colors ${hasPreviousData
              ? 'bg-[#6B5B95]/10 group-hover:bg-[#6B5B95]'
              : 'bg-[#E5E9ED]'
              }`}>
              <History className={`w-7 h-7 transition-colors ${hasPreviousData
                ? 'text-[#6B5B95] group-hover:text-white'
                : 'text-[#7A8088]'
                }`} />
            </div>
            <h3 className={`text-xl mb-2 ${hasPreviousData ? 'text-[#1F2933]' : 'text-[#7A8088]'}`}>
              View Previous Analysis
            </h3>
            <p className="text-sm text-[#5E6C7A] leading-relaxed">
              {hasPreviousData
                ? `Access your ${previousCount} previous report${previousCount > 1 ? 's' : ''} and track health trends`
                : 'No previous analysis found. Upload a report to get started.'}
            </p>

            {hasPreviousData && (
              <>
                <div className="flex items-center gap-2 mt-4 text-[#6B5B95]">
                  <span className="text-sm">View History</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2E7D5B]/10 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D5B]" />
                    <span className="text-xs text-[#2E7D5B]">{previousCount} report{previousCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-[#5E6C7A]"
        >
          For informational purposes only • Not medical advice
        </motion.p>
      </motion.div>
    </div>
  );
}
