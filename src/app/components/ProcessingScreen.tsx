import { motion } from 'motion/react';
import { FileCheck, Scan, CheckCircle2 } from 'lucide-react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  // Simulate processing
  setTimeout(onComplete, 3000);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-lg border border-[#E5E9ED] p-8">
          {/* Processing Steps */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-[#2E7D5B]/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#2E7D5B]" />
              </div>
              <div>
                <p className="text-sm text-[#1F2933]">File Validated</p>
                <p className="text-xs text-[#5E6C7A]">Format and quality verified</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-[#3A9CA6]/10 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Scan className="w-5 h-5 text-[#3A9CA6]" />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-[#1F2933]">Processing Report</p>
                <p className="text-xs text-[#5E6C7A]">Extracting parameters and values</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-[#E5E9ED] rounded-full flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-[#5E6C7A]" />
              </div>
              <div>
                <p className="text-sm text-[#5E6C7A]">Generating Insights</p>
                <p className="text-xs text-[#5E6C7A]">Preparing your health clarity view</p>
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="h-1 bg-[#E5E9ED] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-[#3A9CA6] to-[#6B5B95]"
              />
            </div>
          </div>

          {/* Confidence Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-6 p-4 bg-[#3A9CA6]/5 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#5E6C7A]">OCR Confidence</span>
              <span className="text-sm text-[#2E7D5B]">98.5%</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
